# Security boundary

This repository is a UI prototype. The role picker stores a local demo profile;
it is not authentication or authorization. The API currently exposes only a
health endpoint and does not validate those roles.

Do not deploy this project with real user data or privileged operations until a
server-side identity flow, role assignment process, authorization checks, and
durable storage have been designed and tested. Hiding screens by role in the
mobile client is never an access-control boundary.

The standalone preview server is suitable only for serving generated static
artifacts. Put it behind a trusted reverse proxy that overwrites forwarded
headers and terminates TLS.
