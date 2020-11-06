rm -rf application.zip
rm -rf flashcards.zip
npm run build
cp flashcards_56.png flashcards_112.png manifest.webapp dist
cd dist
zip -q ../application.zip  css/* index.html js/* flashcards_56.png flashcards_112.png manifest.webapp
cd ..
zip -q flashcards.zip application.zip metadata.json update.webapp