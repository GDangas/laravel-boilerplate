# Tekniker
#### Laravel
Boilerplate är byggt på Laravel 5.5. 
#### AdminLTE
Systemet använder sig av ett admin-temapaket som heter AdminLTE 2 och bygger på Twitter Bootstrap 3.
Dokumentation här:
https://almsaeedstudio.com/themes/AdminLTE/documentation/index.html
# Utveckling
Utveckling sker enklast med i Laravel Homestead. Installationsdokumentation finns här:
http://laravel.com/docs/homestead
#### Environment och Composer
Kopiera ```.env.example``` till ```.env``` och ändra i denna vid behov. 
Det är .env-filen som styr Systemvariabler. Checka aldrig in din .env-fil!
Installera Composer-dependencies med ```composer selfupdate``` följt av ```composer install```
Detta kommer skapa upp mappen ```vendor``` med nödvändigt innehåll
När du gör detta ska du stå i projekt-rooten där composer.json finns. 
### Artisan
Kör följande artisan-kommandon från din homestead-maskin från projekt-rooten:
 
```php artisan key:generate``` och ```php artisan migrate```.

Detta för att initiera projektspecifik nyckel samt köra migrationen som möjliggör autentisering (user och password-tabell).

### Installation av temaresurser
För temats resurser och utveckling av dessa används Node, Npm & Gulp.
Allt relaterat till detta ligger i mappen ```gulp-automation```. 
Installera Node. Besök http://nodejs.org och installera senaste vesionen.
Installationen av Node installerar även npm.
Kontrollera att du har node och npm:
```node -v``` och ```npm -v```.

Navigera till ```your-project-name/gulp-automation.```
```
npm install -g gulp
gulp -v
npm install
```
Gulp tasks som finns är ```gulp build``` som bygger alla resurser inklusive externa assets. (ex. Bootstrap & jQuery)
Denna måste köras före ```gulp  dev``` som endast bygger projekt-assets. Denna kör även Watch och BrowserSync.
 
Vid driftsättning körs ```gulp build --production``` för att minifiera och uglifiera samtliga assets.


===================================================================================================
