cd tmp
echo 'Captioning input images...'
for img in xx*; do

   width=$(identify -format %W ${img})
   width=$(( ${width} * 4 / 10 ))

   convert                  \
     -background '#0008'    \
     -gravity center        \
     -fill white            \
     -size ${width}x30     \
      caption:"${img:2:3}"      \
      "${img}"              \
     +swap                  \
     -gravity south         \
     -composite             \
      "captioned-input-${img}"

done

echo 'Captioning output images...'
for img in zzxx*; do

   width=$(identify -format %W ${img})
   width=$(( ${width} * 4 / 10 ))

   convert                  \
     -background '#0008'    \
     -gravity center        \
     -fill white            \
     -size ${width}x30     \
      caption:"${img:4:3}"      \
      "${img}"              \
     +swap                  \
     -gravity south         \
     -composite             \
      "captioned-output-${img}"

done
echo 'Done'
cd ..
