const { SitemapStream, 
    streamToPromise }       = require('sitemap')
const { createGzip }        = require('zlib')
const { Readable }          = require('stream')
const constant              = require(__basePath + '/app/config/constant');
const config                = require(constant.path.app + 'core/configuration')
const resourceService       = require(constant.path.module + 'resource/resource.service');
const tagService            = require(constant.path.module + 'tag/tag.service');

let sitemap;

exports.sitemap             =  (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    if (sitemap) return res.send(sitemap);
  
    try {
        const smStream        = new SitemapStream({ hostname : config.server.url })
        const pipeline        = smStream.pipe(createGzip())

        smStream.write({ url: '/',          changefreq: 'daily',     priority: 1 });
        smStream.write({ url: '/profile',   changefreq: 'weekly',    priority: 0.3 });
        smStream.write({ url: '/ideabox',   changefreq: 'daily',     priority: 0.7 });
        smStream.write({ url: '/tags',      changefreq: 'daily',     priority: 0.7 });
        smStream.write({ url: '/about',     changefreq: 'weekly',    priority: 0.5 });

        resourceService.getResources({}, function(error, resources) {
            if(error) {
                res.status(500).end()
            } 
            resources.forEach(resource => {
                smStream.write({ url: `/resource/${resource.slugUrl}`,  changefreq: 'weekly',  priority: 0.7 })
            });
            tagService.getTags({}, function(error, tags) {
                if(error) {
                    res.status(500).end()
                } 
                tags.forEach(tag => {
                    smStream.write({ url: `/tag/${tag.slugUrl}`,  changefreq: 'daily',  priority: 0.7 })
                });            
                // cache the response
                streamToPromise(pipeline).then(sm => sitemap = sm)
                // make sure to attach a write stream such as streamToPromise before ending
                smStream.end()
                // stream write the response
                pipeline.pipe(res).on('error', (e) => {throw e})
            });
        });
    } catch (e) {
      console.error(e)
      res.status(500).end()
    }
}