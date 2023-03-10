# Configure the chat of WorkAdventure

## Ejabberd
### Some explanation
To better understand what we'll be talking about, let's define an abstract variable called `EJABBERD_HOST=xmpp.workadventure.localhost` which is the URL from which you can access the Ejabberd container over the internet.
To ensure that the Ejabberd container is operational, set the following environment variables :
- `EJABBERD_JWT_SECRET`: This is the secret used to sign all temporary passwords generated by the pusher in order to identify each user and allow them to connect to the XMPP server.
- `EJABBERD_DOMAIN`: The domain that will be used to identify each user in your Ejabberd network. A JID is the unique ID assigned to the user, such as `johndoe\40workadventu.re@xmpp.example.com` where `xmpp.example.com` is the `EJABBERD_DOMAIN`. (This variable could be the same as the URL of your Ejabberd container `EJABBERD_HOST`)

The back container will use the following variables to create the ChatRooms from the map file. It will also be used to access the Ejabberd administration panel at `$EJABBERD_HOST/admin`.
- `EJABBERD USER`: The admin user that is created when the Ejabberd container is launched.
- `EJABBERD PASSWORD`: This is the admin user's plain password, as defined above.
Additionally, the variable `EJABBERD_WS_URI` defined in `docker-compose.yaml` should be edited. It's value MUST be `ws://$EJABBERD_HOST/ws` (in development with no HTTPS enabled) or `wss://$EJABBERD_HOST/ws` in production (with HTTPS enabled).
> **Note**: `ws://` is the protocol for Websockets, and `wss://` is the protocol for secured websockets.


### Configuring Ejabberd
If you want, you can modify the Ejabberd configuration file, which is located at `xmpp/ejabberd.template.yml`. You can add more environment variables by using `$VAR`, but you must ensure that those variables are defined because they will be replaced when the container is launched or built.
If some variables are not defined, the container will not start, and an error message will be displayed in the Ejabberd container's logs.

### What to do
1. In the `.env` file :
   * Set you secret JWT sign, set the environment variable : `EJABBERD_JWT_SECRET=mySecretJwt`
   * Set your domain : `EJABBERD_DOMAIN=xmpp.workadventure.localhost`
   * Set the admin login of Ejabberd : `EJABBERD_USER=admin`
   * Set the password of the admin account of Ejabberd : `EJABBERD_PASSWORD=apideo`
2. After that you can start the Ejabberd container successfully.


### _For production environments :_
- `EJABBERD_HOST=xmpp.workadventure.localhost` must be defined.
- The variable `EJABBERD_API_URI=http://ejabberd:5443/api` is also defined; this variable must not be changed; it will be used only between the container Back -> Ejabberd; it will not pass through the internet, but only within Docker's local network.
  If you change the name of the container, you'll have to change `EJABBERD_API_URI`.


## Chat options
Change the following environment variables in the `.env` file to configure the chat features:
- Enable or disable chat (this will not disable all chat, but only ChatRooms and forums; the timeline will remain active) : `ENABLE_CHAT=true`
- Enable or disable the online user list : `ENABLE_CHAT_ONLINE_LIST=true`
- Enable or disable the disconnected user list : `ENABLE_CHAT_DISCONNECTED_LIST=true`
- Enable or disable file upload in chat (MUST BE TRUE ONLY IF ENABLE CHAT IS TRUE) : `ENABLE_CHAT_UPLOAD=true`
- Maximum uploadable file size (Byte) in chat : `UPLOAD_MAX_FILESIZE=10485760`