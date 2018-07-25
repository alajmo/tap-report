#!/bin/bash

set -eum
IFS=$'\n\t'

init() {
  rm media/* -rf
  mkdir media/png
}

simulate_tap_report() {
  local CMD='
    clear
    export PS1="\$ "
    sleep 2s
    echo "$ node scripts/tap-report-example.js | tap-report" | pv -qL 30
    node scripts/tap-report-example.js | tap-report
    sleep 5s
    echo 1
  '

  # Simulate typing
  asciinema rec -c "$CMD" --max-wait 100 --title tap-report --quiet media/output.json &
  fg %1
}

generate_gif() {
  # Convert to gif
  docker run --rm -v "$PWD":/data asciinema/asciicast2gif -h 30 media/output.json media/output.gif
}

generate_png() {
  # Generate png's from gif
  convert -verbose -coalesce media/output.gif media/png/output.png

  # Remove all png's except last sequence
  find media/png/*.png | sort -n -t "-" -k 2 | head -n -1 | xargs rm

  mv media/png/*.png media/output.png
  rm media/png -r
}

main() {
  init
  simulate_tap_report
  generate_gif
  # generate_png
}
main
