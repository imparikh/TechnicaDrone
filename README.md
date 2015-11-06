# TechnicaDrone
 -----
|ABOUT|
 -----
Using an unmanned aerial vehicle (Parrot AR.Drone 2.0 Elite Edition) to carry and splatter paint over a canvas at a location selected by a remote web user online.

 -------
|AUTHORS|
 -------
Code developed using felixge/node-ar-drone by Ishaan Parikh, Nick Aversano, Stefanie Cohen, Patrice-Morgan Ongoly, and Joshua Ermias.

 ------
|SET UP|
 ------
 Note: These instructions are for individuals using a machine running OS X El Capitan with Python 2.6 or later and NodeJS v4.2.2 or later installed.
 
 1) Download files onto your local machine and open the destination folder in your terminal.
 2) Set up your Parrot AR.Drone 2.0 and plug in the battery. Wait for the drone to turn on and get set. Make sure it is on level ground.
 3) Deactivate and then immediately reactivate your Wi-Fi. 
 4) Look for and connect to the signal running on the drone (e.g. format "ardroneXXXXXX").
 5) Wait for confirmation of connection. Return to your terminal and test the connection by typing in "node drone.js".
 6) The drone should connect and fly. It will loiter for five (5) seconds and then perform three motions -- one in the X direction, one in the Y direction, and a flip.
 7) After the satisfactory completion of the motions, the drone will land and the test is complete.
 8) The remaining files can be run or manipulated for your personal purpose or code can be run directly from the terminal.
 9) Happy flying!
