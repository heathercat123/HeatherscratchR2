# HeatherscratchR2
WIP open-source remake of ScratchR2

## Setting it all up (rudimentary guide)
1. Install Git from [here](https://git-scm.com/)
2. Clone the repo
  - For that, run this:
```
git clone https://github.com/heathercat123/HeatherscratchR2.git
cd HeatherscratchR2
```
3. Get Python 2.7 [here](https://www.python.org/downloads/release/python-2718/).
4. Install the requirements.
  - To do that, run this:
```
pip install -r requirements.txt
```
5. Set up the database access info.
  - To do that, copy /scratchr2/local_settings.default.py to local_settings.py
  - If you're on a production environment, set up the values for a database engine other than sqlite3.
6. Install the forums.
  - To do that, go into /s2forums and run this command:
```
python setup.py install
```
7. Set up the database.
  - To do that, run this command:
```
python manage.py syncdb
```
8. Set up translations
  - For this, run these commands:
```
git clone https://github.com/scratchfoundation/scratchr2_translations.git
cd scratchr2_translations
git checkout a01d7f6
move ui ..\scratchr2\locale
cd ..
python manage.py compilemessages
```
  - Ignore the 'detached HEAD' advice
9. Run the dev server.
  - To do this, run this command:
```
python manage.py runserver
```
10. Open your web browser at [http://localhost:8000/scratchr2/](http://localhost:8000/scratchr2/)

The base site should work. The images and CSS might be broken, in that case, we need to set up a webserver. The rest of this guide is for Apache.

1. Create a new VirtualHost.
   - It should look like this one based on Heatherscratch's:
   - If you have [HeatherscratchR](https://github.com/heathercat123/HeatherscratchR set up, add everything in between `ServerAlias www.scratch.local` and `</VirtualHost>` after `</Directory>` in the [HeatherscratchR](https://github.com/heathercat123/HeatherscratchR VirtualHost
```
<VirtualHost *:80>
    ServerName scratch.local
    ServerAlias www.scratch.local
    Options FollowSymLinks
    RewriteEngine On

    ## ScratchR2 ##

    # Should perfectly re-create Scratch's NGINX setup's behavior
    AliasMatch "^/scratchr2/static/+(__[a-zA-Z0-9_-]+__)?/*(.*)$" "C:/xampp/htdocs/scratchr2/static/$2"

    RewriteCond %{REQUEST_URI} !/scratchr2/static
    RewriteCond %{REQUEST_URI} !/scratchr2/wiki
    RewriteRule ^/scratchr2(.*) http://localhost:8000/scratchr2$1 [P,L]
    ProxyPassReverse "/scratchr2" "http://localhost:8000/scratchr2"

    # Are those necessary?
    ProxyPass "/csrf_token" "http://localhost:8000/csrf_token"
    ProxyPassReverse "/csrf_token" "http://localhost:8000/csrf_token"

    ProxyPass "/site-api" "http://localhost:8000/site-api"
    ProxyPassReverse "/site-api" "http://localhost:8000/site-api"

    ProxyPass "/i18n" "http://localhost:8000/i18n"
    ProxyPassReverse "/i18n" "http://localhost:8000/i18n"

    ProxyPass "/jsi18n" "http://localhost:8000/jsi18n"
    ProxyPassReverse "/jsi18n" "http://localhost:8000/jsi18n"

    # Scratch 2 Online Editor

    ProxyPass "/help/studio/tips" "http://localhost:8000/scratchr2/help/studio/tips"
    ProxyPassReverse "/help/studio/tips" "http://localhost:8000/scratchr2/help/studio/tips"

    ProxyPass "/session" "http://localhost:8000/scratchr2/session"
    ProxyPassReverse "/session" "http://localhost:8000/scratchr2/session"
</VirtualHost>

```
HeatherscratchR2 should now just work. Except for the forums index. You need to set it up yourself in the Django Admin site based on [Scratch](https://scratch.mit.edu/discuss)'s.

## Extra notes for license
Some Javascript libraries are under a different license. They can be found under /static/js/lib and opening them in a text editor should reveal their license. If you can't find a license, there should be a link on every library. Click on it to find the license.