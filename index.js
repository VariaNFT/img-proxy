addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method !== 'GET') {
    return new Response('Method not Allowed', {
      status: 405,
    })
  }

  const url = new URL(request.url)
  const target = decodeURI(url.pathname.substr(1)).replace(/https:\/([^\/])/, 'https://$1').replace(/https\/([^\/])/, 'http://$1')
  try {
    new URL(target)
    const req = await fetch(target)
    if (!req.headers.get('Content-Type').startsWith('image')) {
      return new Response(JSON.stringify({error: 'Not a image'}), {
        headers: {
          'content-type': 'application/json',
        },
        status: 400,
      })
    }
    return new Response(req.body, {
      headers: {
        'content-type': req.headers.get('Content-Type'),
        'access-control-allow-origin': 'https://app.varianft.studio'
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({error: 'Not a valid url'}), {
      headers: { 'content-type': 'application/json' },
      status: 400,
    })
  }
}
