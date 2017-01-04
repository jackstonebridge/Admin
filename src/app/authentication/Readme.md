# Module Authentication

## Dependencies (_via bower_)

- jQuery
- es6-promise
- underscore.js
- angular-ui-router
- angular-resource
- angular-notify
- angular-gettext
- bcryptjs
- src/app/libraries/asmcrypto_bn.js
- src/app/libraries/base32.js
- src/app/libraries/pmcrypto.js

### About `src/app/libraries/asmcrypto_bn.js`

> If there is an error you need to edit the file and on the last line, replace `({},function(){return this}());` to `({},function(){return window}());`;


## Usage

You will need to load the module `proton.commons` too.

### 1 Create custom states for the application

Custom config for authentication module.

```js
.config((urlProvider, authStatesProvider, CONFIG) => {
    urlProvider.setBaseUrl(CONFIG.apiUrl);
    authStatesProvider.config({
        main: 'lookup',
        login: 'index',
        loginSub: 'login.sub',
        loginSetup: 'login.setup',
        loginUnlock: 'login.unlock',
        resetPassword: 'support.reset-password',
        reset: 'reset',
        namespaces: {
             authenticated: 'lookup',
             login: 'index'
        }
    });
});
```

> If your application only have 2 states such as *main* and *login*, set the main key and the login. Every others need to be set with `login`

_It's better to use a namespace for your states allowed when the user is authenticated_

### 2 Update the layout (_index.html_)
ex: 
```html
<!-- build:js lib/js/main.min.js -->
    <script type="text/javascript" src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="../bower_components/underscore/underscore-min.js"></script>
    <script type="text/javascript" src="../bower_components/angular/angular.js"></script>
    <script type="text/javascript" src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script type="text/javascript" src="../bower_components/angular-cookies/angular-cookies.min.js"></script>
    <script type="text/javascript" src="../bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script type="text/javascript" src="../bower_components/angular-resource/angular-resource.min.js"></script>
    <script type="text/javascript" src="../bower_components/angular-notify/dist/angular-notify.min.js"></script>
    <script type="text/javascript" src="../bower_components/angular-gettext/dist/angular-gettext.min.js"></script>
    <script type="text/javascript" src="../bower_components/papaparse/papaparse.min.js"></script>
    <script type="text/javascript" src="../bower_components/bcryptjs/dist/bcrypt.min.js"></script>
    <script
    <!-- endbuild -->
    <!-- Custom Scripts -->
    <script type="text/javascript" src="js/openpgp.min.js"></script>
    <script type="text/javascript" src="js/dashboard.min.js"></script>
    </head>
```

> You need to load `openpgp.min.js` out of other vendors

### 3 Templating

> You don't need to use our templates for the login, you can use yours but, **You need to use the same classnames (_add yours_)** and be sure to have the same angular binding (else it won't work);

There is a main view for the login state, you can name it `login.tpl.html`, and the markup should contain:

```html
<login-form ng-show="twoFactor === 0"></login-form>
<login-two-factor-form ng-show="twoFactor === 1"></login-two-factor-form>
```

