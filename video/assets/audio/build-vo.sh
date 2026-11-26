#!/bin/bash
# Place the 8 VO segments on one 59 s track at their scene offsets (ms).
cd "$(dirname "$0")"
OFF=(600 8600 18100 24000 32100 36600 44300 52000)
in=""; f=""; mix=""
for i in 0 1 2 3 4 5 6 7; do in="$in -i vo-s$((i+1)).wav"; f="$f[$i]aresample=48000,adelay=${OFF[$i]}|${OFF[$i]}[a$i];"; mix="$mix[a$i]"; done
ffmpeg -v error -y $in -filter_complex "${f}${mix}amix=inputs=8:normalize=0,apad=whole_dur=59,atrim=0:59,loudnorm=I=-16:TP=-1.5:LRA=11" -ar 48000 -ac 2 vo.wav
