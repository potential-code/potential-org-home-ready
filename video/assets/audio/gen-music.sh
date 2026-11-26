#!/bin/bash
# Light ambient music bed, synthesised locally with ffmpeg (no external source).
# Progression Cmaj9 - Am9 - Fmaj9 - Gsus/6, 4 s per chord, 64 s total, soft attack/release, reverb, low-pass.
set -e
cd "$(dirname "$0")"
chord() { # name dur freqs...
  n=$1; d=$2; shift 2; expr=""
  for f in "$@"; do expr="$expr+0.12*sin(2*PI*$f*t)*(0.75+0.25*sin(2*PI*0.21*t))"; done
  ffmpeg -v error -y -f lavfi -i "aevalsrc='${expr:1}':s=48000:d=$d" -af "afade=t=in:d=1.4,afade=t=out:st=$(echo "$d-1.6"|bc):d=1.6" -ac 2 _c_$n.wav
}
chord 1 4.6 130.81 196.00 246.94 293.66 329.63
chord 2 4.6 110.00 164.81 196.00 246.94 261.63
chord 3 4.6 87.31 130.81 174.61 220.00 261.63 329.63
chord 4 4.6 98.00 146.83 196.00 220.00 261.63 293.66
: > _list.txt
for r in 1 2 3 4; do for c in 1 2 3 4; do echo "file '_c_$c.wav'" >> _list.txt; done; done
# overlap chords via acrossfade chain is costly; concat then smooth with reverb
ffmpeg -v error -y -f concat -safe 0 -i _list.txt -af "aecho=0.8:0.85:120|240|420:0.35|0.25|0.18,lowpass=f=2200,highpass=f=60,volume=0.9,afade=t=in:d=2,afade=t=out:st=60:d=4,atrim=0:64" -ar 48000 bgm.wav
rm -f _c_*.wav _list.txt
