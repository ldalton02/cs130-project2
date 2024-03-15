# Bruin Banter

At Bruin Banter, we believe in fostering meaningful connections while respecting the need for privacy and anonymity. Our platform offers a unique way for students at UCLA to engage in real-time conversations through anonymous chat rooms. Users can access and read chat rooms at popular campus spots, and actually join in on the conversation when in close priximity.

### Privacy and Authenticity
To ensure authenticity and enhance the sense of community, users can only post messages within a certain range of the chat room's location. This feature encourages genuine interactions and discourages spam or irrelevant content. Furthermore, we prioritize user privacy and anonymity. You can chat freely without the pressure of revealing your identity. Enjoy open discussions, share thoughts, seek advice, or simply connect with peers without the fear of judgment.

## How to Join

To visit our up and running website, visit [Bruin Banter](https://bruinbanter.netlify.app/) here!

## Installation and Local Usage

Clone our git repository locally :
```
git clone https://github.com/ldalton02/cs130-project2.git
```
Ensure that Node.js or npm is installed on your system. It can be downloaded from [here](https://nodejs.org/en/). Install the version of npm that we used by running: 
```
npm install npm@10.2.4
```

Navigate inside the project directory and install the necessary node package modules:
```
npm install
```
Finally, run the following to run the project at localhost:3000
```
npm run dev
```

Disclaimer: Running Google Maps API requires a private key which has not been publicly released. Recommended use is through our deployed and live version. <br /> <br />
If you would like to run locally with your own Google Maps API key, create a file called **.env.local** at the root of the repository and add the following line:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<YOUR API KEY>
```

## User Manual

To understand how to use the live website or a locally hosted version, visit our [user manual](https://github.com/ldalton02/cs130-project2/wiki/User-Manual).
