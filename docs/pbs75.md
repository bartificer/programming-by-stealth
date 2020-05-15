# PBS 75 of X — AJAX Intro

Having wrapped up our introduction to Mustache templates we’re going to spend the next few instalments learning about AJAX, a very powerful JavaScript technique for loading information from a given URL. In future instalments we’ll use this technique to load external templates and data for use with our Mustache templates.

AJAX is a mechanism for making a HTTP requests via JavaScript, so before we’re ready to learn about AJAX we need to take the time to learn about the HTTP protocol itself. Unless you understand the mechanics and the terminology of HTTP, AJAX-related documentation simply won’t make any sense.

# Matching Podcast Episode 589

Listen along to this instalment on [episode 589 of the Chit Chat Across the Pond Podcast](https://www.podfeet.com/blog/2019/04/ccatp-589/)

<audio controls src="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_04_06.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="https://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2019_04_06.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## PBS 74 Challenge Extension & Hint

I’ve decided to give everyone an extension on the challenge set at the end of [the previous instalment](https://bartificer.net/pbs74).

Based on some listener feedback, I’d also like to give a little hint you might find helpful.

The JSON object is not intended to be used as the actual view object when rendering templates. It’s designed to be used as the data source from which you build your view objects.

## HTTP Overview

Rather that look at all of HTTP in great detail, I’m going to focus this overview on the parts of the HTTP spec that are relevant to AJAX. If you’d like to know more I’d. suggest checking out instalments [34](https://www.bartbusschots.ie/s/2015/05/09/taming-the-terminal-part-34-of-n-introducing-http/) and [35](https://www.bartbusschots.ie/s/2015/07/05/taming-the-terminal-part-35-of-n-http-commands/) of the [Taming the Terminal series](https://bartb.ie/ttt).

Starting with the very basics, HTTP is the _Hyper-Text Transfer Protocol_. Web browsers use this protocol to fetch data for URLs starting with `http://` and `https://`. HTTP is a client-server request-response protocol — clients (web browsers in our case) send HTTP requests to web servers, and web servers respond with HTTP responses. The protocol is stateless, so each request+response is seen as un-related to every other request+response. In the modern world we’re accustomed to having web servers remember who we are from click to click, so how is that possible? Cookies were literally invented to work around the fact that HTTP is a stateless protocol. A cookie is simply a token a web server can include in an HTTP response that the client then inserts into all future requests so the web server can recognise you.

Note that HTTPS is just HTTP with a TLS (Transport Layer Security) wrapper around it, so from a Javascript point of view, `http://` and `https://` URLs are equivalent.

At the very highest level, HTTP requests contain a URL, and HTTP responses contain the data at the requested URL, or some information about the data at the requested URL.

## HTTP Requests

HTTP requests consist of:

*   A URL
*   A HTTP method
*   Arbitrarily many HTTP Request Headers
*   Optional form data

The HTTP method is used to specify the type of request the browser is making. For now, we’ll only be using HTTP to fetch information from web servers, but the protocol is much broader than that, and provides mechanisms for sending data insertion, data update, and even data deletion requests to servers.

### URLs

URLs are surprisingly complex things, and they can contain a lot of information. For our purposes, URLs have the following components:

1.  A _URL Scheme_, or _Protocol_ followed by the symbols `://`. For our purposes, the scheme will always be one of `http`, `https`, or `file`.
2.  A _host_, or server (if relevant), e.g. `localhost`, `bartb.ie`, or `podfeet.com`. The host is appended to the scheme, but separated from it by the `://` symbols. The `file` scheme omits the host part of the URL completely.
3.  A _port number_, implied or explicit (if appropriate). Explicit port numbers are appended to the host, separated from it with the `:` symbol. URL schemes imply port numbers where appropriate, so you can usually omit them. `http` implies port `80`, and `https` implies port `443`, so `http://bartb.ie` actually implies `http://bartb.ie:80`. The `file` scheme omits port numbers completely.
4.  A _path_ or _file path_ which specifies a location on a host. The file path always starts with a `/` character.
5.  An optional _page fragment_ which specifies a named location within a page. If present, the fragment is appended after the file path, separated from it with a `#` symbol.
6.  An optional _query string_ which specifies an arbitrary number of name-value pairs known as _query parameters_. If present, the query string is appended after the page fragment (or file path if there is no page fragment), and separate from it with the `?` symbol. Each name-value pair is separated from the others with an `&` symbol, and the names are separated from the values with an `=` symbol.

Note that special characters have to be escaped in URLs. They’re escaped using the `%` symbol followed by two hexadecimal characters. Since we’ll be using JavaScript to make our AJAX queries we’ll have API functions to translate the special characters for us, so we don’t need to know them. If you’re curious, you’ll find more details on [this W3Schools page](https://www.w3schools.com/tags/ref_urlencode.asp).

Let’s tie all that together with an example URL:

`http://localhost:8080/testFolder/testFile.html#section1?param1=boogers&param2=some%20stuff`

We can then say the following:

*   The _scheme_ is `http`
*   The _host_ is `localhost`
*   The _port_ is `8080`
*   The _file path_ is `/testFolder/testFile.html`
*   The _page fragment_ is `section1`
*   The _query string_ is param1=boogers&param2=some%20stuff
*   There are. two _query parameters_; `param1` and `param2`
*   The value of the _query parameter_ `param1` is `'boogers'`
*   The value of the _query parameter_ `param2` is `'some stuff'` (`%20` is the URL escape code for the space symbol).

### HTTP Methods

For now, there are just two HTTP methods relevant to us — `GET` and `POST`.

Philosophically, `GET` requests should never alter the internal state of the server, and it should be safe to cache the responses. `POST` requests should be used when the intent of the request is to change the server’s state in some way (e.g. submit a comment on a blog post), and the responses to `POST` requests should not be cached.

From a practical point of view, the biggest difference between `GET` and `POST` is how form data gets encoded into the request.

Both `GET` and `POST` requests can include relatively small amounts of data in the form of query parameters within the URL. In addition to that, `POST` requests can contain as much data as is needed in the so-called _request body_, but `GET` requests can’t.

It’s very important to note that query parameters should never be used to send sensitive data because they are a part of the URL, and URLs get logged. For this reason, always send sensitive data to web servers with `POST` requests.

`GET` is the default method, and that’s what we’ll be using for now.

### HTTP Request Headers and Cookies

HTTP request headers allow the client to share certain defined pieces of information with the server. The most widely used request header is the `User-Agent` header which the browser uses to identify itself to the server.

Cookies are actually passed to the server using the `Cookie` HTTP header.

### Seeing an HTTP Request

To help you see the innards of an HTTP request I’ve created a little server-side script that echoes back details of the HTTP request it received in an HTTP response: [https://bartb.ie/utils/httpEcho/](https://bartb.ie/utils/httpEcho/).

As well as seeing the request in HTML you can also see it in pure JSON format at [https://bartb.ie/utils/httpEcho/json](https://bartb.ie/utils/httpEcho/json), in pretty-printed JSON format at [https://bartb.ie/utils/httpEcho/jsonText](https://bartb.ie/utils/httpEcho/jsonText), and in plain text (Markdown really) at [https://bartb.ie/utils/httpEcho/text](https://bartb.ie/utils/httpEcho/text).

Note that you can pass query parameters to the script by adding them to the end of the URL, e.g. [https://bartb.ie/utils/httpEcho/?param1=boogers&param2=big%20snot](https://bartb.ie/utils/httpEcho/?param1=boogers&param2=big%20snot)

Note that you can find [the full source code for these PHP scripts on GitHub](https://github.com/bbusschots/httpEcho.php/). Remember that one of the reasons I gave for loving Mustache is that its available in so many languages. Well, to underline that point, note that the HTML and plain-text views are both generated using Mustache templates, and that the view object used is the JSON object presented by the JSON and pretty-printed JSON scripts.

## HTTP Responses

A HTTP response consists of the following:

*   An HTTP status code
*   Arbitrarily many HTTP response headers
*   If appropriate, a response body containing the requested data

Servers use HTTP status codes to indicate the nature of their response. These are always 3-digit numbers, and can be accompanied by a short human-readable title/description. The one you want is `200 OK`!

Under the hood HTTP status codes are grouped into categories by leading digit:

`1**` — Informational

The browser deals with informational responses for us, so we don’t have to worry about them. Examples include `100 Continue`, and `101 Switching Protocols`.

`2**` — Successful

For `GET` and `POST` requests, the response code you always hope to get is `200 OK`, that means the request was successfully processed, and that the response contains the requested data. There are other successful status codes for other HTTP methods, e.g. `201 Created`.

`3**` — Redirection

Browsers will automatically follow redirects, so JavaScript developers generally don’t have to concern themselves with following redirects. The two most commonly used redirection status codes are `301 Moved Permanently` for permanent redirects, and `302 Found` for temporary redirects. The main difference is that browsers are permitted to cache permanent redirects, but temporary redirects should be checked every time in case they’ve changed.

`4**` — Client Errors

As JavaScript developers we hope not see many of these errors because the browser constructs the requests for us, so unless there’s a nasty bug in our browsers, we should never see status codes like `400 Bad Request`. However, there are two client errors we are likely to encounter from time to time — the infamous `404 Not Found`, and the frustrating `403 Forbidden`.

`5**` — Server Errors

Later in the series we’ll be moving into server-side coding, at which time we’ll almost certainly get to see lots of `500 Internal Server Error` responses. For now, any server error status codes indicate problems beyond our control.

Bottom line, as JavaScript developers there are only four status codes we need to keep in our minds — `200 OK`, `403 Forbidden`, `404 Not Found`, and `500 Internal Server Error`.

When it comes to processing HTTP responses, we generally just need to deal with two cases — we got a `200 OK`, so our request was successful, or we got any other status code, so our request was not successful, and we need to handle that fact in some way.

Basically, anything other than `200 OK` means there was some kind of error, and our code needs to deal with that in some way.

The HTTP response headers are used by the server to send information about the response back to the client. The most important HTTP response header is `Content-Type` which tells the browser the MIME Type of the data included in the response. The server can also use the headers to give cookies to the browser, and to tell the browser how long it should cache the response for.

## A Final Illustration

We can use my httpEcho script in conjunction with the curl terminal command (Mac & Linux only I’m afraid) to peer inside a full HTTP transaction.

The command we’ll be using is:

`curl -v --data-urlencode d1=val1 --data-urlencode d2=val2 --cookie 'c1=cookie; c2=monster' https://www.bartbusschots.ie/utils/httpEcho/text?p1=param1Val\&p2=param2Val`

There’s a lot there, so let’s break it down piece-by-piece.

Firstly, the `-v` flag puts `curl` into verbose mode. That means it will show us the raw HTTP request it is generating, as well as all the details of the HTTP response it receives.

The two `--data-urlencode` flags put `curl` into `POST` mode and add two pieces of form data named `d1` and `d2` with the values `val1` and `val2` respectively.

The `--cookie` flag sets two cookies named `c1` and `c2` with the values `cookie` and `monster` respectively.

Finally, we are calling the httpEcho URL for the plain-text version of the output with a query string that specifies two query string parameters named `p1` and `p2` with the values `param1Val` and `param2Val` respectively.

When we run the command we get a lot of output!

```shell
bart-imac2018:~ bart$ curl -v --data-urlencode d1=val1 --data-urlencode d2=val2 --cookie 'c1=cookie; c2=monster' https://www.bartbusschots.ie/utils/httpEcho/text?p1=param1Val\&p2=param2Val
*   Trying 37.139.7.12...
* TCP_NODELAY set
* Connected to www.bartbusschots.ie (37.139.7.12) port 443 (#0)
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: /etc/ssl/cert.pem
  CApath: none
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use http/1.1
* Server certificate:
*  subject: CN=bartbusschots.ie
*  start date: Mar  5 08:15:48 2019 GMT
*  expire date: Jun  3 08:15:48 2019 GMT
*  subjectAltName: host "www.bartbusschots.ie" matched cert's "www.bartbusschots.ie"
*  issuer: C=US; O=Let's Encrypt; CN=Let's Encrypt Authority X3
*  SSL certificate verify ok.
> POST /utils/httpEcho/text?p1=param1Val&p2=param2Val HTTP/1.1
> Host: www.bartbusschots.ie
> User-Agent: curl/7.54.0
> Accept: */*
> Cookie: c1=cookie; c2=monster
> Content-Length: 15
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 15 out of 15 bytes
< HTTP/1.1 200 OK
< Server: nginx/1.12.2
< Date: Sat, 06 Apr 2019 15:19:04 GMT
< Content-Type: text/plain;charset=UTF-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< X-Powered-By: PHP/5.6.39
<
# Client
- IP:                          46.7.114.231
- Browser (User Agent String): curl/7.54.0

# HTTP Request
- URL:              https://www.bartbusschots.ie/utils/httpEcho/text?p1=param1Val&p2=param2Val
- Protocol Version: HTTP/1.1
- Method:           POST
- Headers (6):
  * Host: www.bartbusschots.ie
  * User-Agent: curl/7.54.0
  * Accept: */*
  * Cookie: c1=cookie; c2=monster
  * Content-Length: 15
  * Content-Type: application/x-www-form-urlencoded
- Query String:     p1=param1Val&p2=param2Val
- Query Parameters (2):
  * p1: param1Val
  * p2: param2Val
- Form Data (2):
  * d1: val1
  * d2: val2
- Cookies (2):
  * c1: cookie
  * c2: monster

# Server
- IP:Port:      37.139.7.12:443
- Name:         bartbusschots.ie
- Software:     nginx/1.12.2
- CGI Revision: CGI/1.1
* Connection #0 to host www.bartbusschots.ie left intact
```

Again, let’s break it down.

The first thing we see is some information about what `curl` is doing. You see it trying to connect to the IP address of my server, you see it succeeding on port 443, and then you see it successfully negotiate a secure connection using TLS.

At this stage `curl` is finally ready to send the HTTP request, so the next thing we see is that request:

```shell
> POST /utils/httpEcho/text?p1=param1Val&p2=param2Val HTTP/1.1
> Host: www.bartbusschots.ie
> User-Agent: curl/7.54.0
> Accept: */*
> Cookie: c1=cookie; c2=monster
> Content-Length: 15
> Content-Type: application/x-www-form-urlencoded
```

Notice that `curl` uses the `User-Agent` header to identify itself, and the `Cookie` header to pass our two cookies to the server.

The next thing we see is the HTTP response from the servers, starting with the status code and the response headers:

```shell
< HTTP/1.1 200 OK
< Server: nginx/1.12.2
< Date: Sat, 06 Apr 2019 15:19:04 GMT
< Content-Type: text/plain;charset=UTF-8
< Transfer-Encoding: chunked
< Connection: keep-alive
< X-Powered-By: PHP/5.6.39
```

Notice we got a `200 OK` status, and the use of the `Content-Type` HTTP response header to specify both the MIME Type and the text encoding of the returned data.

Finally, we see the actual data returned by the server, in this case, the plain-text echoing of the data the server received just as it would appear in a browser window:

```shell
# Client
- IP:                          46.7.114.231
- Browser (User Agent String): curl/7.54.0

# HTTP Request
- URL:              https://www.bartbusschots.ie/utils/httpEcho/text?p1=param1Val&p2=param2Val
- Protocol Version: HTTP/1.1
- Method:           POST
- Headers (6):
  * Host: www.bartbusschots.ie
  * User-Agent: curl/7.54.0
  * Accept: */*
  * Cookie: c1=cookie; c2=monster
  * Content-Length: 15
  * Content-Type: application/x-www-form-urlencoded
- Query String:     p1=param1Val&p2=param2Val
- Query Parameters (2):
  * p1: param1Val
  * p2: param2Val
- Form Data (2):
  * d1: val1
  * d2: val2
- Cookies (2):
  * c1: cookie
  * c2: monster

# Server
- IP:Port:      37.139.7.12:443
- Name:         bartbusschots.ie
- Software:     nginx/1.12.2
- CGI Revision: CGI/1.1
```

## Final Thoughts

Now that we’ve seen the HTTP protocol in action we’re ready to learn how to make HTTP requests from Javascript using AJAX. Or, to be more specific, how to use jQuery’s `$.ajax()` function to make HTTP requests. That’s where we’ll start the next instalment.
