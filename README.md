
SONG MATCH
------------------------------
1. What does it do?
------------------------------

Song Match asks the user for a US artist, then asks the user 3 questions about themselves before giving them a unique song by that artist.
-------------------------
2. How did I do this?
-------------------------
First, I got the general format of responses working, then I configured the Spotify API, and made a working algorithm, finally, I combined the two together.
------------------------
3. What was my algorithm?
------------------------
Since I’m asking three different questions with two different possible responses, that would be equal to (2^3 = 8) possible answers, So with that in mind, I had each answer be attached to a true or false boolean, and dependent on the answer knocked out songs in the upper or lower 60 percent of the possible range for the audio feature category that answer represented (Valence, Danceability, and Speechiness, see Audio Feature categories below for more info). 
-
It then checked through each category and eliminated songs that didn’t fit the requirements. If there was more than one song left after a round of checking, the range would get smaller. This repeated until only one song remained.
----------------------------						
4. Example of  SONG MATCH
----------------------------

User - open song match
-
Alexa- Welcome to Song Match. I can help you understand which song by your favorite artist best matches your life. Please tell me the name of your favorite artist.
-
User- drake
-
Alexa- Great. drake. Now please answer these three questions to help me match you to a drake song. First, would you rather be a fan of the Los Angeles Lakers or Clippers?
-
User- lakers
-
Alexa- The lakers! Well, Let me ask now, On a regular Friday night, would you rather watch netflix or go out?
-
User- netflix
-
Alexa-Netflix! Interesting, Would you rather talk to Mark Wahlberg or Kevin Hart?
-
User- kevin hart
-
Alexa- your drake song is Club Paradise. Wanna try again with a different artist?
-
User-no
-
Alexa- Thanks for playing Song Match! I hope I found a song that fits you!
-
----------
5. Audio Feature categories
						

Valence - The higher the value the more positive the song is
-
Danceability - Describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.
-
Speechiness - Detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.
-
						
6. Links

Spotify API
------------------------------------------------
 Endpoints used:
[Grabbing an Artists’s ID](https://developer.spotify.com/documentation/web-api/reference/search/search/)
[Grabbing an Artist’s Albums](https://developer.spotify.com/documentation/web-api/reference/artists/get-artists-albums/)
[Grabbing an Albums tracks](https://developer.spotify.com/documentation/web-api/reference/albums/get-albums-tracks/)
[Getting multiple tracks audio features](https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/)
-------------------------------------------------
