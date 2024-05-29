rm -rf application.zip
rm -rf flashcards.zip
npm run build
cp assets/flashcards_56.png assets/flashcards_112.png assets/manifest.webapp dist
cd dist
zip -q ../application.zip  css/* index.html js/* flashcards_56.png flashcards_112.png manifest.webapp
cd ..
zip -qj flashcards.zip application.zip assets/metadata.json assets/update.webapp
rm -rf application.zip