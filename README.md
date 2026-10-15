# Login Component

Reactive Forms are a good fit : Official Signal-based forms ecosystem is still evolving, whereas Reactive Forms are completely production-ready.

## JWT validation

The login component receives an access token from the API and stores it for
subsequent requests. The API must verify the JWT's signature and claims before
authorizing protected operations. A client may decode claims for display or
user experience, but decoding does not verify the signature and must not be
used as proof of authorization. Never put a signing secret in the frontend.

# Pending:
Test cases were not written due to time constraints.

# Questions:

A. Where should the access token be stored in the browser, and what are the trade-offs?
ans:​localStorage / sessionStorage: Easy to implement, but vulnerable to XSS if malicious scripts get injected.
​Best practice today is using In-Memory storage combined with an HttpOnly Refresh Token cookie for session persistence

B. The sample app.config.json contains a value named CLIENT_SECRET. Is this a problem, and what should be done about it?

ans: Frontend apps like Angular run in the browser, so configuration values can be viewed using DevTools. Never expose CLIENT_SECRET in frontend code. Use OAuth 2.0 with PKCE for SPAs or a Backend for Frontend (BFF) to securely handle secrets on the server.

# AI Tool:
I used GitHub Copilot to troubleshoot and resolve some issues encountered during development.