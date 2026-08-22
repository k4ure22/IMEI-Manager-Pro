const app = Application.currentApplication();
app.includeStandardAdditions = true;
const str = app.read(Path("/Users/martin/Desktop/IMEI/Views/js/dashboard.js"));
try {
    eval(str);
    console.log("OK");
} catch(e) {
    console.log(e.name + ": " + e.message + " at line " + e.line);
}
