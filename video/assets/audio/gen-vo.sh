#!/bin/bash
# Kokoro local TTS (hyperframes tts) per voice-over segment, voice af_heart.
export PATH=$HOME/.nvm/versions/node/v22.22.2/bin:$PATH
export HYPERFRAMES_PYTHON=$(dirname "$0")/../../.venv/bin/python
HF="node /home/aliya/.claude/plugins/cache/hyperframes/hyperframes/0.8.120/skills/hyperframes/scripts/plugin-cli.mjs"
cd "$(dirname "$0")"
V=${VOICE:-af_heart}
i=0
while IFS= read -r line; do i=$((i+1)); $HF tts "$line" -v $V -s ${SPEED:-1.0} -o vo-s$i.wav --json; done <<'T'
Home Ready is a free programme from Potential.org that helps people in the U.A.E. decide whether to rent or buy.
Let's say I'm Aisha, renting in Al Barsha. Once I sign in, my home page shows my next step: my tenancy renews in 84 days.
I run the renew-or-move journey, check the official Rental Index, and save my checklist.
Now I'm Rohan, thinking of buying our first home. I change how long we'll stay, and the calculator updates instantly.
When I open a sponsored offer, nothing is shared unless I tick yes.
I'm Maya, the programme owner. Every fee and rule is reviewed, dated, and in English and Arabic before I publish it.
And I'm Hessa, from Potential.org's leadership. I can see who took a useful first step and who came back.
Home Ready, by Potential.org. Powered by Potential.com.
T
