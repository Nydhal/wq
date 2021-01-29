---
order: 5
---

Authentication
========

[wq.db.rest.auth]

[wq.db]'s [REST API] provides a simple authentication service powered by Django's [auth module].  When `wq.db.rest.auth` is included in your `INSTALLED_APPS`, the following URLs will be registered with the [router].

url | purpose
----|--------
`/login` | Displays a form for entering username and password.  Note that it is up to you to provide the required template, `login.html`.
`/login.json` | Used by [wq/app.js] to submit and/or verify login information.  A successful login will return the user information as well as a user-specific [wq configuration object].
`/logout` | Logs out the user and displays a success message.  Note that it is up to you to provide the required template, `logout.html`.
`/logout.json` | Used by [wq/app.js] to log out the user via AJAX.

### Social Authentication

As an alternative to traditional username/password authentication, wq.db is designed to work with [Python Social Auth], which provides a wide array of social-network-powered authentication options.  Most social auth URLs are configured separately by that library, and do not require custom templates.  The one common customization is to provide a list of connected social networks in e.g. a user profile page.  This can be done in by leveraging the custom `social_auth` information provided by wq.db as an attribute on the `user` context variable:

```javascript
{
  "username": "myusername",
  // ...
  "social_auth": {
    "accounts": [{
      "provider_id": "myface"
      "provider_label": "MyFace",
      "id": 1234,
      "label": "myusername@myface",
      "can_disconnect": false
    }]
  }
}
```

### Template Context Variables
[wq.db.rest.auth.context_processors] provides an `{{#is_authenticated}}` context variable for use in rendering templates that require authenticated users.  It is recommended to always place references to the `{{#user}}` template variable inside of the `{{#is_authenticated}}` block, e.g.:

```xml
{{#is_authenticated}}
  {{#user}}
    Logged in as {{username}}
    {{#social_auth}}
    Connected Accounts:
    <ul>
    {{#accounts}}
      <li>
        <img src="/images/{{provider_id}}.png">
        {{label}} ({{provider_label}})
      </li>
    {{/accounts}}
    </ul>
  {{/user}}
{{/is_authenticated}}
```

[wq.db.rest.auth]: https://github.com/wq/wq.db/blob/master/rest/auth/
[wq.db]: https://wq.io
[REST API]: https://wq.io/docs/about-rest
[auth module]: https://docs.djangoproject.com/en/1.7/topics/auth/
[router]: https://wq.io/docs/router
[wq/app.js]: https://wq.io/docs/app-js
[wq configuration object]: https://wq.io/docs/config
[Python Social Auth]: http://psa.matiasaguirre.net/
[wq.db.rest.auth.context_processors]: https://github.com/wq/wq.db/blob/master/rest/auth/context_processors.py
