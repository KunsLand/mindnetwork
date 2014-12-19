MindNetwork is a website application trying to provide a visual view of the knowledge system. It is mainly originated from the Social Network Analysis(SNA) [course] I take from [Coursera].

This project is technically based on [Sigma.js] which is a open source project and available on [github].

Currentlly, there are four versions of MindNetwork.
* The current master branch is the initial branch and developed with node.js, express and mongodb. It is not deployed on any cloud platform and only runnable on local host.
* The `gh-pages` branch is a github-hosting [version](https://kunsland.github.io/mindnetwork). Its data is stored in [MongoLab] and accessed in a [ajax] way. As I used a free service, the response of data request from the server is not stable. Sometime it will take about 10 or more seconds to get ajax response from MongoLab.
* The `postgresql` branch is a version developed with node.js, express and postgresql. It is deployed on [heroku] and can be visited [here]. The database service is fair enough now, although the initial loading takes a long time (which I think is mainly because I am in China).
* The `sae` branch is developed on Sina App Engine([SAE]). The main differences lie on server side which uses PHP and MySQL. The published site is [here](http://mindnetwork.sinaapp.com).

[course]:https://class.coursera.org/sna-004
[Coursera]:https://www.coursera.org/
[Sigma.js]:http://sigmajs.org/
[github]:https://github.com/jacomyal/sigma.js
[MongoLab]:https://mongolab.com
[ajax]:http://www.w3schools.com/ajax/
[heroku]:https://www.heroku.com/
[here]:https://mindnetwork.herokuapp.com/
[SAE]:http://sae.sina.com.cn