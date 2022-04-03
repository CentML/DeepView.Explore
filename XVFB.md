# Setup Xvfb and VNC on headless Linux
We first install the necessary pacakges:
```
apt-get install xvfb x11vnc i3 xfce4-terminal
```
Then, we create a virtual framebuffer with `Xvfb`:
```
Xvfb -screen 0 1920x1080x24
```
Then, start `x11vnc` on the newly created X display:
```
DISPLAY=:0 x11vnc
```
Finally, start the desktop environment on the same display:
```
DISPLAY=:0 i3
```
If you wish to use a different desktop environment as i3, replace the last part accordingly. 
