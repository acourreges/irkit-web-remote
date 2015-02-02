# [IRKit Web Remote](http://www.adriancourreges.com/projects/irkit-web-remote/)

[IRKit Web Remote](http://www.adriancourreges.com/projects/irkit-web-remote/) is a web-interface able to dispatch IR commands to [IRKit devices](http://getirkit.com).  
Control your home appliances through your browser - even from outside your home.

![Screenshot](/media/irkit_web_remote.png)

## Features

* Define your own IR commands and *series of commands*, with timing information.
* Mobile and desktop-friendly with a responsive design.
* Can be exposed to the Internet: control your devices from outside your home.
* Command queue to avoid overloading IRKit. Queue is cancellable.
* Can initialize any IRKit device still in factory-settings.


## Requirements

A web-server able to serve static files through HTTP.

Optional: PHP5 with `curl` support is required if you want to make the interface available over the Internet.

## Setup

- Copy all the files of the `public` folder into a folder which can be served by your server.
- Customize `js/Config.js` to declare some IRKit device identifiers and their IP address.
- Define IR commands (or series of commands) in the file `js/Commands.js`.
- Customize `index.html` to suit your needs.

## Use

Just open `index.html` in a web-browser.  
If you need to initialize a new IRKit device you can open `setup.html`.
