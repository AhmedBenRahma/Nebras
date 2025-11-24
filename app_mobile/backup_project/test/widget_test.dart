import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:App_mobile/app.dart';

void main() {
  testWidgets('App starts and displays HomeScreen', (WidgetTester tester) async {
    await tester.pumpWidget(App());

    expect(find.byType(HomeScreen), findsOneWidget);
  });

  testWidgets('HomeScreen has a title', (WidgetTester tester) async {
    await tester.pumpWidget(App());

    expect(find.text('Home'), findsOneWidget);
  });

  testWidgets('CameraScreen is navigable from HomeScreen', (WidgetTester tester) async {
    await tester.pumpWidget(App());

    // Assuming there's a button to navigate to CameraScreen
    final cameraButton = find.byKey(Key('cameraButton'));
    await tester.tap(cameraButton);
    await tester.pumpAndSettle();

    expect(find.byType(CameraScreen), findsOneWidget);
  });
}