; Script de Inno Setup para IMEI Manager Pro
; Para compilar: Abrir este archivo en Inno Setup Compiler y presionar F9 (o ejecutar: iscc installer_windows.iss)

#define MyAppName "IMEI Manager Pro"
#define MyAppVersion "2.0"
#define MyAppPublisher "IMEI Manager Pro Team"
#define MyAppExeName "IMEI Manager Pro.exe"
#define MyAppIcon "Controllers\logoIMPlight.ico"

[Setup]
; Identificador único de la aplicación
AppId={{D8C61E55-8A19-4F72-B589-91EF4D1F31B9}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=dist_installer
OutputBaseFilename=Instalador_IMEI_Manager_Pro_v{#MyAppVersion}_Setup
SetupIconFile={#MyAppIcon}
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#MyAppExeName}

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "installdeps"; Description: "Configurar dependencias del sistema (Google Chrome y Tesseract OCR)"; GroupDescription: "Componentes del entorno:"; Flags: unchecked

[Files]
; Incluir todos los archivos generados por PyInstaller en dist\IMEI Manager Pro
Source: "dist\IMEI Manager Pro\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "instalar_dependencias_windows.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "LEEME-WINDOWS.txt"; DestDir: "{app}"; Flags: ignoreversion

[Dirs]
Name: "{app}\FilesIMP"; Permissions: users-modify
Name: "{app}\temp_screenshots"; Permissions: users-modify
Name: "{app}\Controllers\temp_screenshots"; Permissions: users-modify
Name: "{app}\Resultados_Masivos"; Permissions: users-modify

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\Configurar Dependencias (Chrome y OCR)"; Filename: "{app}\instalar_dependencias_windows.bat"; IconFilename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\instalar_dependencias_windows.bat"; Description: "Instalar dependencias necesarias (Google Chrome y Tesseract OCR)"; Flags: shellexec runhidden postinstall skipifsilent; Tasks: installdeps
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent


