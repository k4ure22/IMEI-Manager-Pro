import LocalAuthentication
import Foundation

let context = LAContext()
var error: NSError?

// Comprobar si se solicitó solo verificar soporte
let isCheckOnly = CommandLine.arguments.contains("--check")

if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
    if isCheckOnly {
        print("SUPPORTED")
        exit(0)
    }
    
    let reason = "Iniciar sesión en IMEI Manager Pro"
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, authenticationError in
        if success {
            print("SUCCESS")
            exit(0)
        } else {
            if let err = authenticationError as NSError? {
                print("ERROR: \(err.localizedDescription)")
            } else {
                print("ERROR: Cancelado o fallido")
            }
            exit(1)
        }
    }
} else {
    if let err = error {
        print("ERROR: Biometría no disponible. \(err.localizedDescription)")
    } else {
        print("ERROR: Biometría no disponible.")
    }
    exit(2)
}

// Mantener el script corriendo hasta que la política termine (ya que es asíncrono)
if !isCheckOnly {
    RunLoop.current.run(until: Date(timeIntervalSinceNow: 15))
}
