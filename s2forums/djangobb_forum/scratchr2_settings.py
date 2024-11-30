from djangobb_forum.settings import *
import codecs

#DjangoBB Forum Settings
# Described here: https://bitbucket.org/slav0nic/djangobb/src/a4c0272533a9/forum/settings.py
FORUM_BASE_TITLE = 'Discuss Scratch'
PM_SUPPORT = False
HEADER = 'Discuss Scratch'
TAGLINE = ''
REPUTATION_SUPPORT = False
ATTACHMENT_SUPPORT = False
GRAVATAR_SUPPORT = False
DISPLAY_PROFILE_MENU_OPTIONS = False
DISPLAY_AVATAR_OPTIONS = False
DISPLAY_USERTITLE = False
# The value is the topic id where deleted posts should be sent
SOFT_DELETE_POSTS = 412
# The value is the forum id where deleted topics should be sent
SOFT_DELETE_TOPICS = 2
ALLOW_POLLS = False
POST_FLOOD = True
POST_FLOOD_SLOW = 120
POST_FLOOD_MED = 60
TOPIC_CLOSE_DELAY = 24 * 60 * 60
POST_DELETE_DELAY = 24 * 60 * 60

# Spam settings
SPAM_CATEGORY_NAME = "Moderator Only Forums"
SPAM_FORUM_NAME = "Spam Dustbin"
SPAM_TOPIC_NAME = "Spam Dustbin"

TOPIC_PAGE_SIZE = 20
FORUM_PAGE_SIZE = 25
SIGNATURE_MAX_LINES = 10
SIGNATURE_MAX_LENGTH = 2000
AUTHORITY_SUPPORT = False
DEFAULT_TIME_ZONE = 0
IMAGE_HOST_WHITELIST = r'(?:(?:tinypic|photobucket|cubeupload)\.com|imageshack\.(?:com|us)|modshare\.tk|(?:scratchr|wikipedia|wikimedia|modshare\.futuresight)\.org|(?<!scratch\.mit)\.edu|scratch-dach\.info)$'

# Allowed paths for embedded images hosted on *.scratch.mit.edu
SCRATCH_IMAGE_PATH_WHITELIST = r'^(?:/scratchr2/static|/static/site/|/get_image/|/w/images/)'
#rot13 the filter for the sake of Scratchers linking to the public repo
LANGUAGE_FILTER = codecs.encode(r'(?v)\o(shtyl|(\j*?)shpx(\j*?)|s(h|i|\*)?p?x(vat?)?|(\j*?)fu(v|1|y)g(\j*?)|pe(n|@|\*)c(cre|crq|l)?|(onq|qhzo|wnpx)?(n|@)ff(u(b|0)yr|jvcr)?|(onq|qhzo|wnpx)?(n|@)efr(u(b|0)yr|jvcr)?|onfgneq|o(v|1|y|\*)?g?pu(r?f)?|phag|phz|(tbq?)?qnz(a|z)(vg)?|qbhpur(\j*?)|(arj)?snt(tbg|tng)?|sevt(tra|tva|tvat)?|bzst|cvff(\j*?)|cbea|encr|ergneq|frk|f r k|fung|fyhg|gvg|ju(b|0)er(\j*?)|jg(s|su|u))(f|rq)?\o', 'rot13')
