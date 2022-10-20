# put setup script here
# - create default config file
# - etc

echo "########################"
echo "## setting up project ##"
echo "########################"
echo
echo

FILE=.env

if test -f "$FILE"; then
  echo "$FILE exists."
else
  echo "$FILE doesn't exist, copying .env.example as .env"
  cp .env.example .env
fi

echo "read through comments in .env.example if you are unsure about certain env vars."

echo
echo
echo "########################"
echo "##        done        ##"
echo "########################"