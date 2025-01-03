# HeatherscratchR2
WIP open-source remake of ScratchR2

## Setting it all up
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
  - To do that, rename /scratchr2/database.default.py to database.py.
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

The base site should work. Now, we need to set up a webserver. The rest of this guide is for Apache.

1. Create a new virtualhost:
   - It should look like this:
```
   <VirtualHost 127.0.0.1>
      ServerName scratchr2.local
      ServerAlias www.scratchr2.local
		Options FollowSymLinks
		RewriteEngine   On
		
		# ScratchR2
		Alias "/scratchr2/static" "PATH_TO_HEATHERSCRATCHR2/static"
		RewriteCond %{REQUEST_URI} !/scratchr2/static
		RewriteCond %{REQUEST_URI} !/scratchr2/wiki
		RewriteRule ^/scratchr2/(.*) http://localhost:8008/scratchr2/$1 [P,L]
		ProxyPassReverse "/scratchr2" "http://localhost:8008/scratchr2"
		
		ProxyPass "/csrf_token" "http://localhost:8008/csrf_token"
		ProxyPassReverse "/csrf_token" "http://localhost:8008/csrf_token"
		
		ProxyPass "/site-api" "http://localhost:8008/site-api"
		ProxyPassReverse "/site-api" "http://localhost:8008/site-api"
		
		ProxyPass "/i18n" "http://localhost:8008/i18n"
		ProxyPassReverse "/i18n" "http://localhost:8008/i18n"
		
		ProxyPass "/jsi18n" "http://localhost:8008/jsi18n"
		ProxyPassReverse "/jsi18n" "http://localhost:8008/jsi18n"
		
		# Scratch 2 Online Editor
		
		ProxyPass "/help/studio/tips" "http://localhost:8008/scratchr2/help/studio/tips"
		ProxyPassReverse "/help/studio/tips" "http://localhost:8008/scratchr2/help/studio/tips"
		
		ProxyPass "/session" "http://localhost:8008/scratchr2/session"
		ProxyPassReverse "/session" "http://localhost:8008/scratchr2/session"
    </VirtualHost>

```
HeatherscratchR2 should now just work. Except for the forums index. You need to set it up yourself in the Django Admin site.

## Extra notes for license
Some Javascript libraries are under a different license. They can be found under /static/js/lib and opening them in a text editor should reveal their license.
