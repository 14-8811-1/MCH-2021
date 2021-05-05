# MCH 2021
 
The MCH chatbot is used to search the node packages. The **npms.io** service is used for it. It offers a better scoring 
system than the npmjs.org and analyze the npm ecosystem from variety of sources to get better results even if you do not
know exact name of what you are looking for.

At first, you should say hello to the chatbot, it will greet you back and list you possible commands to start the conversation.
There are two main conversation.

## Search modules
Let's start with the first one which is started by command 'search modules'. First question is fill the query will be used
for search. It can contain multiple words describing what you are looking for, then you fill whether the unstable and
insecure modules should be included. These values are of type boolean so only values 'yes' and 'no' are allowed. If a user
fill in an invalid value, he is asked to fill in valid value or cancel the conversation using command 'end conversation'.
Last question is to specify how man result should be listed (1-5).
For each module there are basic information listed and then comes the end of the conversation.

## Module info 
Second conversation is started by command 'module info'. First question is to fill the exact name of the module which user wants.
If the exact module is not found, it performs the search for modules with similar name and ask the user if it what he 
was looking for, but only in case that it found a some module. If the user fill in yes, then the information is displayed.
then comes the end of the conversation.