# App_mobile

## Overview
App_mobile is a Flutter application designed to capture images, extract text from those images, convert the text to speech, and analyze the frequency of detected words. This project leverages various services to provide a seamless user experience.

## Features
- Capture images using the device camera.
- Extract text from images using Optical Character Recognition (OCR).
- Convert extracted text to speech.
- Send detected words to a backend platform for frequency analysis.

## Project Structure
```
App_mobile
├── android                # Android platform-specific code
├── ios                    # iOS platform-specific code
├── lib                    # Main application code
│   ├── main.dart          # Entry point of the application
│   ├── app.dart           # Main application widget
│   ├── screens            # Contains screen widgets
│   │   ├── home_screen.dart  # Home screen widget
│   │   └── camera_screen.dart # Camera screen widget
│   ├── widgets            # Reusable widgets
│   │   └── recognized_text_tile.dart # Widget to display recognized text
│   ├── models             # Data models
│   │   └── detected_word.dart # Model for detected words
│   ├── services           # Services for various functionalities
│   │   ├── camera_service.dart # Camera functionalities
│   │   ├── ocr_service.dart    # OCR functionalities
│   │   ├── tts_service.dart     # Text-to-speech functionalities
│   │   └── api_service.dart     # API communication
│   ├── repositories        # Data repositories
│   │   └── word_repository.dart # Manages detected words
│   └── utils              # Utility functions and constants
│       └── constants.dart  # Application constants
├── assets                 # Asset files
│   ├── images             # Image assets
│   └── icons              # Icon assets
├── test                   # Test files
│   └── widget_test.dart   # Widget tests
├── pubspec.yaml           # Project configuration
├── analysis_options.yaml   # Dart analysis options
├── .gitignore             # Files to ignore in version control
└── README.md              # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd App_mobile
   ```
3. Install dependencies:
   ```
   flutter pub get
   ```
4. Run the application:
   ```
   flutter run
   ```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.