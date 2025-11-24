import 'dart:convert';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:http/http.dart' as http;

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) => const MaterialApp(home: HomeScreen());
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SmartPen - App_mobile')),
      body: Center(
        child: ElevatedButton(
          key: const Key('openCamera'),
          onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const CameraScreen())),
          child: const Text('Ouvrir caméra'),
        ),
      ),
    );
  }
}

class CameraScreen extends StatefulWidget {
  const CameraScreen({Key? key}) : super(key: key);
  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  CameraController? _controller;
  String _detectedText = '';
  bool _busy = false;
  final FlutterTts _tts = FlutterTts();
  final TextRecognizer _textRecognizer = TextRecognizer(script: TextRecognitionScript.latin);

  @override
  void initState() {
    super.initState();
    _initCamera();
  }

  Future<void> _initCamera() async {
    final cameras = await availableCameras();
    final back = cameras.firstWhere(
      (c) => c.lensDirection == CameraLensDirection.back,
      orElse: () => cameras.first,
    );
    _controller = CameraController(back, ResolutionPreset.medium, enableAudio: false);
    await _controller!.initialize();
    if (mounted) setState(() {});
  }

  Future<void> _captureAndProcess() async {
    if (_controller == null || !_controller!.value.isInitialized || _busy) return;
    setState(() => _busy = true);
    try {
      final file = await _controller!.takePicture();
      final inputImage = InputImage.fromFilePath(file.path);
      final result = await _textRecognizer.processImage(inputImage);
      final text = result.text.trim();
      setState(() => _detectedText = text.isEmpty ? 'Aucun texte détecté' : text);

      if (text.isNotEmpty) {
        await _tts.setLanguage('fr-FR');
        await _tts.setSpeechRate(0.45);
        await _tts.speak(text);

        final words = _extractWords(text);
        await _sendWordsToBackend(words);
      }
    } catch (e) {
      setState(() => _detectedText = 'Erreur: $e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  List<String> _extractWords(String text) {
    final re = RegExp(r"[A-Za-zÀ-ÖØ-öø-ÿ']+");
    return re.allMatches(text).map((m) => m.group(0)!.toLowerCase()).toList();
  }

  Future<void> _sendWordsToBackend(List<String> words) async {
    if (words.isEmpty) return;
    try {
      final uri = Uri.parse('http://10.0.2.2:3000/api/words');
      await http.post(uri, headers: {'Content-Type': 'application/json'}, body: jsonEncode({'words': words}));
    } catch (_) {
      // ignore réseau en prototype
    }
  }

  @override
  void dispose() {
    _controller?.dispose();
    _textRecognizer.close();
    _tts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_controller == null || !_controller!.value.isInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Camera OCR')),
      body: Stack(
        children: [
          CameraPreview(_controller!),
          Positioned(
            left: 12,
            right: 12,
            bottom: 16,
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Container(padding: const EdgeInsets.all(8), color: Colors.black54, child: SingleChildScrollView(child: Text(_detectedText, style: const TextStyle(color: Colors.white)))),
              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                ElevatedButton(key: const Key('captureButton'), onPressed: _busy ? null : _captureAndProcess, child: Text(_busy ? 'Traitement...' : 'Capture & OCR')),
                const SizedBox(width: 12),
                ElevatedButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Retour')),
              ])
            ]),
          ),
        ],
      ),
    );
  }
}