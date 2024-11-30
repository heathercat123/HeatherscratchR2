# HeatherscratchR2
WIP open-source remake of ScratchR2

## Setting it all up
**I haven't tested this guide yet. If you have any issues, tell me under, well, issues**
1. Get Python 2.7 [here](https://www.python.org/downloads/release/python-2718/).
2. Get PIL from [here](https://github.com/lightkeeper/lswindows-lib/blob/master/amd64/python/PIL-1.1.7.win-amd64-py2.7.exe?raw=true). Link is for Windows.
3. Install the requirements.
  - To do that, run this:
```
python -m pip install -r requirements.txt
```
4. Set up the database access info.
  - To do that, rename /scratchr2/database.default.py to database.py.
  - If you're on a production environment, set up the values for a database engine other than sqlite3.
5. Install the forums.
  - To do that, go into /s2forums and run python setup.py install
6. Set up the database.
  - To do that, run this command:
```
python manage.py syncdb
```
7. Replace every instance of C:/XAMPP/HTDOCS/SCRATCHR2_PY27/ in /scratchr2/settings.py to the path to HeatherscratchR2
8. Run the dev server.
  - To do this, run this command:
```
python manage.py runserver
```
9. Open your web browser at [http://localhost:8000/scratchr2/](http://localhost:8000/scratchr2/)

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
HeatherscratchR2 should now just work.

## Extra notes for license
Some Javascript libraries are under a different license. They can be found under /static/js/lib and opening them in a text editor should reveal their license.
