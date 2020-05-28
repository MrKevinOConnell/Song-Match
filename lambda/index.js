// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.

const Alexa = require('ask-sdk-core');
const querystring = require('querystring');
var request = require('request-promise'); 

//Init handler for when skill begins or when start over is called
const LaunchRequestHandler = 
{  //makes sure that the yes intent is called or the program is just starting
    canHandle(handlerInput) 
    {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
    return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest')|| Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YesIntent'&& (attributes.done=== true ||attributes.err === true);
    },
   async handle(handlerInput) 
    {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
    var speakOutput = '';
    //different dialog if program is being restarted
    if(attributes.err === true|| attributes.done === true)
    {
        speakOutput = "Welcome back! Which artist do you want to try this time?"
    }
    
    else
    {
     speakOutput = 'Welcome to Song Match. I can help you understand which song by your favorite artist best matches your life. Please tell me the name of your favorite artist.';
    }
    //initalizing attributes
    attributes.lastSaid  = speakOutput;
    attributes.counter = 0;
   
    attributes.artist = '';
    attributes.tempArtist = '';
    
    attributes.a1 = true;
    attributes.a2 = true;
    attributes.a3 = true;
   attributes.q1 = false
   attributes.q2 = false;
   attributes.q3 = false;
    
     attributes.actor = '';
    attributes.activity = '';
    attributes.sports = '';
    
    attributes.s = '';
    attributes.songIds = [];
    attributes.songNames = [];
    attributes.albIds = new Array(10);
    attributes.token = '';
    attributes.id = '';
    
    attributes.check = false;
    attributes.q = false;
    attributes.done = false;
    attributes.err = false;
   
    attributes.question= [
   "would you rather be a fan of the Los Angeles Lakers or Clippers?","On a regular Friday night, would you rather watch netflix or go out?" ,
   "Would you rather talk to Mark Wahlberg or Kevin Hart?"];
   attributes.add = ["Well, Let me ask now,", "Ok,", "Interesting,","hmm,"];
   
    return handlerInput.responseBuilder
    .speak(speakOutput)
    .reprompt(speakOutput)
    .getResponse();
    }
};



const FavoriteArtistIntentHandler = 
{   //makes sure correct intent is being called
   canHandle(handlerInput)
    {//checks if FavoriteArtistIntent handler is called and that the questions haven't started yet
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'FavoriteArtistIntent')&& attributes.q === false);
    },
   async handle(handlerInput) 
    {
           //sets attributes.artist to the artist slot value and calls the getArtistId method to see if that artist is valid
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      const artist = handlerInput.requestEnvelope.request.intent.slots.artist.value;
       //const yes = handlerInput.requestEnvelope.request.intent.slots.yes.value;
      attributes.artist = artist;
      const response = handlerInput.responseBuilder;
        var speakOutput = '';
        var repromptOutput = '';
     
      //var capitalizedArtist = attributes.artist.charAt(0).toUpperCase() + attributes.artist.slice(1);
   
       await getArtistId(attributes.artist,handlerInput);
        
        handlerInput.attributesManager.setSessionAttributes(attributes);
        
         if(attributes.id === '')
         {
        speakOutput = "invalid artist, please try again";
        return response.speak(speakOutput)
        .reprompt("please say an artist who is in the US market")
        .getResponse();
         }
       
    else
         {
            speakOutput = "Great. " +attributes.artist + ". Now please answer these three questions to help me match you to a " + attributes.artist + " song. First, " + attributes.question[0];
            attributes.lastSaid  = speakOutput;
            attributes.q = true;
             handlerInput.attributesManager.setSessionAttributes(attributes);
            return response.speak(speakOutput)
            .reprompt("I'm a lakers fan, are you?")
            .getResponse();
         }
            
    }
};

const QuestionHandler = 
{
    canHandle(handlerInput)
    {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const request = handlerInput.requestEnvelope.request;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FavoriteArtistIntent'&& attributes.q === true;
    },
    async handle(handlerInput)
    {
        var speakOutput = '';
        var repromptOutput = '';
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        const response = handlerInput.responseBuilder;
        const sports = handlerInput.requestEnvelope.request.intent.slots.sports.value;
          attributes.sports = sports;
          const activity = handlerInput.requestEnvelope.request.intent.slots.activities.value;
            attributes.activity = activity;
             const actor = handlerInput.requestEnvelope.request.intent.slots.actor.value;
          attributes.actor = actor;
        var rand = attributes.add[Math.floor(Math.random() * attributes.add.length)];
        var question = ``;
        
      switch(attributes.counter)
      {
          case 0: attributes.q1 = true; 
          attributes.q2 = false;
          attributes.q3 = false;
          break;
          case 1: attributes.q1 = false;
          attributes.q2 = true;
          attributes.q3 = false;
          break;
          case 2: attributes.q1 = false;
          attributes.q2 = false;
          attributes.q3 = true;
          break;
      }
        if(attributes.q1)
            {
                
           
                if (sports === 'lakers'|| sports === 'Los Angeles lakers')
                {
                attributes.a1 = false;
                speakOutput += "The " +sports + "? "+ rand + " ";
                attributes.lastSaid  = speakOutput;
               
                handlerInput.attributesManager.setSessionAttributes(attributes);
                } 
                else if(sports === 'clippers'|| sports === "Los Angeles clippers") 
                {
                attributes.a1 = true;
                speakOutput += "The "+sports+ "! " + rand;
                attributes.lastSaid  = speakOutput;
            
               
                handlerInput.attributesManager.setSessionAttributes(attributes);
                }
                else
                {
                speakOutput = 'invalid answer, please say either the lakers or clippers';
                repromptOutput = "I like the clippers more than the lakers, who would you choose?";
                return response.speak(speakOutput)
                .reprompt(repromptOutput)
                .getResponse();
                } 
            }  
          else if(attributes.q2)
            {
            
         
                if (activity === 'Netflix')
                {
                attributes.a2 = false;
                speakOutput = activity + "! "+ rand + " ";
                attributes.lastSaid  = speakOutput;
           
                handlerInput.attributesManager.setSessionAttributes(attributes);
                } 
                else if(activity === 'go out') 
                {
                attributes.a2 = true;
                speakOutput = activity+ "? " + rand;
                attributes.lastSaid  = speakOutput;
            
                handlerInput.attributesManager.setSessionAttributes(attributes);
                }
                else
                {
                speakOutput = 'invalid answer, please say either watch netflix or go out';
                repromptOutput = 'I like to stay in and watch netflix, would you rather do that or go out?';
                return response.speak(speakOutput)
                .reprompt(repromptOutput)
                .getResponse();
                } 
          } 
          else if(attributes.q3)
          {
         
       
                if (actor === 'mark Wahlberg')
                {
              
              attributes.a3 = false;
                speakOutput = actor + "? "+ rand + " ";
                
                 attributes.lastSaid  = speakOutput;
               reOrganizeQs(handlerInput);
                handlerInput.attributesManager.setSessionAttributes(attributes);
                } 
                else if(actor === 'Kevin hart') 
                {
               attributes.a3 = true;
                speakOutput = actor+ "! " + rand;
                 attributes.lastSaid  = speakOutput;
                 reOrganizeQs(handlerInput);
                  handlerInput.attributesManager.setSessionAttributes(attributes);
                }
                else
                {
                speakOutput = 'invalid answer, please say either Mark Wahlberg or Kevin Hart';
                repromptOutput = 'I would love to talk to Kevin Hart, would you prefer to talk to him or Mark Wahlberg?';
                return response.speak(speakOutput)
               .reprompt(repromptOutput)
               .getResponse();
                } 
          } 
           //if 3 questions haven't been asked another is prompted.
           if (attributes.counter < 2) 
            {
             speakOutput += " ";
             //makes so q[0] is different
            rand = diffRandomEle(rand,handlerInput);
             reOrganizeQs(handlerInput);
            question = attributes.question[0];
            speakOutput += question;
            repromptOutput = question;
            attributes.lastSaid = speakOutput;
            attributes.counter++;
            handlerInput.attributesManager.setSessionAttributes(attributes);
            return response.speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
            }
            //gets the final song
            else
            {
            await fetchFinalSong(handlerInput);
            speakOutput = "your " + attributes.artist +  ' song is ' + attributes.songNames[0]+ "." ;
            attributes.done = true;
            speakOutput += " Wanna try again with a different artist?"
            return response.speak(speakOutput)
            .reprompt("Wanna try again with a different artist?")
            .getResponse();
            }
            
        
    }
};

const FinishedIntentHandler = 
{ 
    canHandle(handlerInput)
    { const attributes = handlerInput.attributesManager.getSessionAttributes();
    const request = handlerInput.requestEnvelope.request;
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === "NoIntent"&& (attributes.done=== true ||attributes.error === true);
    },
    //gives final output before ending session 
    handle(handlerInput) 
    { const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
    
    var speakOutput = "Thanks for playing Song Match! I hope I found a song that fits you!";
 
   return response.speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
}
};

//called when user says repeat or alexa repeat
const RepeatIntentHandler = 
{   //makes sure correct intent is being called
     canHandle(handlerInput)
    {
    const request = handlerInput.requestEnvelope.request;
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === "RepeatIntent";
    },
    //sets output to what was last said 
    handle(handlerInput) 
    { 
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const response = handlerInput.responseBuilder;
    var speakOutput = attributes.lastSaid;
    var repromptOutput = "I last said, "+ speakOutput;
    return response.speak(speakOutput)
    .reprompt(repromptOutput)
    .getResponse();
    }
};


//called when user says help or alexa help
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) 
    {
    const speakOutput = 'say your favorite artists name and answer three questions to get a song by that artist based on you!';
    return handlerInput.responseBuilder
    .speak(speakOutput)
    .reprompt(speakOutput)
    .getResponse();
    }
};

//called when user says cancel,stop, alexa cancel or alexa stop
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Ok, thanks for playing Song Match!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) 
    {
    const speakOutput = `Sorry, I had trouble finding a song that matches you, want to try again with a different artist?`;
    // Any cleanup logic goes here.
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.err = true;
    return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) 
    {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;
    return handlerInput.responseBuilder
    .speak(speakOutput)
    //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
    .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = 
    {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) 
    {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had an error finding a song that matches you.`;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.err = true;
    handlerInput.attributesManager.setSessionAttributes();
    return handlerInput.responseBuilder
    .speak(speakOutput)
    .reprompt(speakOutput)
    .getResponse();
    }
};


//moves the question asked to the back of the array 
function reOrganizeQs(handlerInput)
{
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.question.push(attributes.question[0]);
    attributes.question.shift(attributes.question[0]);
    
}



async function getToken(handlerInput)
{//request to get the post
    var client_id = '7b70f881b28d4b6ca57035665f3ae768'; // Your client id
    var client_secret = '0e7ee025b21e40fc9d261f5409529481'; 
      const authOptions =
      {
    
      url: 'https://accounts.spotify.com/api/token',
    
      headers: {'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))},
    
      form: {grant_type: 'client_credentials'},
    
      json: true
      };
    await post(authOptions,handlerInput);
}

async function post(auth,handlerInput)
 { //this is where the token is recieved
 const attributes = handlerInput.attributesManager.getSessionAttributes();
  await request.post(auth, function(error, response, body) 
    {
    attributes.token = body.access_token;
    handlerInput.attributesManager.setSessionAttributes();
    })
 }
async function fetchToken(handlerInput)
{
await getToken(handlerInput);
console.log('got token');
}

async function getArtistId(artist,handlerInput)
{ //searches spotifys api for id's that match the name of the artist
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    await fetchToken(handlerInput);
    //console.log('token is '+token);
    const data = 
    {
      q: artist,
      type: 'artist',
      market: "US",
      limit: "1",
      offset: "0"
    };
    const  s = querystring.stringify(data);
    var options = 
    {
     url: 'https://api.spotify.com/v1/search?' + s ,
    headers: 
    {
    'Authorization': 'Bearer ' + attributes.token
    },
   json: true
    };
    await request.get(options, function(error, response, body) 
    {
        if(body.artists.total === 0)
          {
            console.log("invalid artist")
            attributes.id = '';
          }
        
          else
          {
            attributes.id = body.artists.items[0].id;
            attributes.tempArtist = body.artists.items[0].name;
          }
          handlerInput.attributesManager.setSessionAttributes()
          console.log('Got Artist id')
    });
  }

async function getAlbumIds(handlerInput)
{ //adds album ids to albIds
     const attributes = handlerInput.attributesManager.getSessionAttributes();
      const data = 
      {
      market: "US",
      limit: "10"
      };
      const q = querystring.stringify(data);
    
      const options =
      {
        url: 'https://api.spotify.com/v1/artists/' + attributes.id + '/albums?' + q,
        headers: { 'Authorization': 'Bearer ' + attributes.token },
        json: true
      };
    await request.get(options, function(error, response, body) 
    {
      for(var i = 0;i<10;i++)
      {
    
        attributes.albIds[i] = body.items[i].id;
      }
      
      console.log('got albums');
    });
}

async function getSongs(id,handlerInput)
{
const attributes = handlerInput.attributesManager.getSessionAttributes();
  const data = {
  market: "US",
  limit: "20"
  };

  const q = querystring.stringify(data);
  const options =
  {
  url: 'https://api.spotify.com/v1/albums/' + id + '/?' + q,
  headers: { 'Authorization': 'Bearer ' + attributes.token },
  json: true
  };
await request.get(options, function(error, response, body) 
{
    for(var j = 0; j<body.total_tracks;j++)
    { //since only 100 songs are allowed in the audio-features endpoint (when grabbing multiple songs), ends when songIds.length === 100
    var x = body.tracks.items[j].id
    var y = body.tracks.items[j].name;
        if(attributes.songIds.length === 100)
        {
         break;
        }
        else
        {
        attributes.songIds.push(x);
        attributes.songNames.push(y);
        }
    }

});
}

async function readSongs(handlerInput)
{ 
const attributes = handlerInput.attributesManager.getSessionAttributes();
    await getAlbumIds(handlerInput);

    for(let i = 0; i<5;i++)
    {
    await getSongs(attributes.albIds[i],handlerInput);
    }

console.log('read songs :)')
}

async function fetchSongs(handlerInput)
{    
//adds song id's and adds each one to String s for usage in final song.
const attributes = handlerInput.attributesManager.getSessionAttributes();
await readSongs(handlerInput);
console.log('in fetchSongs()')
    for(let j = 0; j<attributes.songIds.length;j++)
    { 
        if (j=== attributes.songIds.length-1)
        {
     attributes.s += attributes.songIds[j];
        }
        else
        {
        attributes.s += attributes.songIds[j]+',';
        }
    }
console.log('grabbed songs')
}
async function finalSong(handlerInput)
{ 
const attributes = handlerInput.attributesManager.getSessionAttributes();

await fetchSongs(handlerInput);
  const data =
  {
  ids: attributes.s
  };
  const q = querystring.stringify(data);
  const options =
  {
  url: 'https://api.spotify.com/v1/audio-features?' + q,
  headers: { 'Authorization': 'Bearer ' + attributes.token },
  json: true
  };
await request.get(options, function(error, response, body) 
    {
        //y = if answer is yes, n = if answer is no, c is just a term I had for rounds when testing
    var y = 0.6;
    var n = 0.4
    var c = 0;
    console.log('before loop: '  + attributes.songIds.length);

//takes songs out of the array if they are above or below set amount (0.6 or 0.4 depending on answer) for valence, danceability and speechiness.
    while(attributes.songNames.length>1 && (y >=0.0 ||n<=1.0))
        {
            c++
            //clippers is answered
          if(attributes.a1)
            { 
            for(let i = 0; i<attributes.songNames.length;i++)
                {
              if(attributes.songNames.length===1)
                    {
                    break;
                    }
                else
                    {
                console.log('y is '+ y)
                if(body.audio_features[i].valence < y)
                        {
                    attributes.songIds.splice(i,1);
                    attributes.songNames.splice(i,1);
                    console.log(attributes.songNames.length);
                        }
                    }   
                }   
        console.log("before a2: " + attributes.songIds.length);
             //go out is answered
            if(attributes.a2)
                {
              for(let i = 0; i<attributes.songNames.length;i++)
                    {  if(attributes.songNames.length===1)
                        {
                        break;
                        }
                    else
                        {
                    if(body.audio_features[i].danceability < y)
                            {
                            attributes.songIds.splice(i,1);
                            attributes.songNames.splice(i,1);
                            console.log(attributes.songNames.length);
                            }
                        }
                    }
                }
                //netflix or watch netflix is answered
            else
                {
              for(let i = 0; i<attributes.songNames.length;i++)
                    {
                    if(attributes.songNames.length===1)
                        {
                        break;
                        }
                        
                    else
                        {
                            if(body.audio_features[i].danceability > n)
                            {
                            attributes.songIds.splice(i,1);
                            attributes.songNames.splice(i,1);
                            console.log(attributes.songNames.length);
                            }
                        }   
                    } 
                }
        console.log("before a3: " + attributes.songIds.length);
        //kevin hart is answered
            if(attributes.a3)
                {
                    for(let i = 0; i<attributes.songNames.length;i++)
                    {  
                        if(attributes.songNames.length===1)
                        {
                        break;
                        }
                        else
                        {
                         if(body.audio_features[i].speechiness < y)
                            {
                            attributes.songIds.splice(i,1);
                            attributes.songNames.splice(i,1);
                            console.log(attributes.songNames.length);
                            }
                        }
                    }
                }
        //mark walhberg is answered
            else
            {
              for(let i = 0; i<attributes.songNames.length;i++)
                {   if(attributes.songNames.length===1)
                  {
                    break;
                  }
                  else
                  {
                  if(attributes.body.audio_features[i].speechiness > n)
                  {
                    attributes.songIds.splice(i,1);
                    attributes.songNames.splice(i,1);
                    console.log(attributes.songNames.length);
                  }
                }
                }
            }
        
        }
        
        //lakers is answered
          else
          {
        
           for(let i = 0; i<attributes.songNames.length;i++)
            {   if(attributes.songNames.length===1)
             {
               break;
             }
             else
             {
             if(body.audio_features[i].valence > n)
                {
                attributes.songIds.splice(i,1);
                attributes.songNames.splice(i,1);
                console.log(attributes.songNames.length);
                }
             }
           }
        
        console.log("after a1: " + attributes.songNames.length);
        //watch netflix or netflix is answered
            if(attributes.a2)
            {
                for(let i = 0; i<attributes.songNames.length;i++)
                {   if(attributes.songNames.length===1)
                    {
                    break;
                    }
                    else
                    {
                        if(body.audio_features[i].danceability < y)
                        {
                        attributes.songIds.splice(i,1);
                        attributes.songNames.splice(i,1);
                        console.log(attributes.songNames.length);
                        }
                    }
                }
            }
            //go out is answered
            else
            {
                for(let i = 0; i<attributes.songNames.length;i++)
                {   
                if(attributes.songNames.length===1)
                  {
                break;
                  }
              else 
                  {
              if(body.audio_features[i].danceability > n)
                       {
                attributes.songIds.splice(i,1);
                attributes.songNames.splice(i,1);
                console.log(attributes.songNames.length);
                       }
                  }
                }
          }
          console.log("after a2: " + attributes.songNames.length);
          //kevin hart is answered
          if(attributes.a3)
          {
            for(let i = 0; i<attributes.songNames.length;i++)
                {   if(attributes.songNames.length===1)
                    {
                    break;
                    }
                    else 
                    {
                        if(body.audio_features[i].speechiness < y)
                        {
                        attributes.songIds.splice(i,1);
                        attributes.songNames.splice(i,1);
                        console.log(attributes.songNames.length);
                        }
                    }
                }
          }
          //mark walhberg is answered
          else
            {
            for(let i = 0; i<attributes.songNames.length;i++)
              {   if(attributes.songNames.length===1)
                {   
                  break;
                }
                else 
                {
                if(body.audio_features[i].speechiness > n)
                    {
                    attributes.songIds.splice(i,1);
                    attributes.songNames.splice(i,1);
                    console.log(attributes.songNames.length);
                    }      
                }
              }
            }
          }
        console.log("after round " + c + ": " + attributes.songNames.length);
      //increments or decrements every time the list is ran until there's only one result left
        y-=(0.025*10)/10;
        n+=(0.025*10)/10;
        }

    });


}

async function  fetchFinalSong(handlerInput)
{
  console.log("in fetchFinalSong()")
 
  await finalSong(handlerInput);
}


//makes sure there there is a different phrase after a question
function diffRandomEle(lastElement,handlerInput) 
{
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    var num = 0;
      do 
      {
         num = Math.floor(Math.random() * this.length);
      } while (attributes.add[num] === lastElement);
      return attributes.add[num];
 }
 //If i ever checked for if the artist the spotify api recieved was different than what was inputted, i would use this (drake via alexa vs. Drake within Spotify API).
 function capitalizedArtist(handlerInput,str) 
{const attributes = handlerInput.attributesManager.getSessionAttributes();
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) 
    {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}


// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FavoriteArtistIntentHandler,
        QuestionHandler,
        FinishedIntentHandler,
        RepeatIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
