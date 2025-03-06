

# Used for breaking up amphoe geojson into separate files by province, allowing for faster search

# Define the input and output directories
input_file="v3/assets/geojson/amphoeSim1.json"
output_dir="v3/assets/geojson/amphoe1"

# Ensure the output directory exists
mkdir -p "$output_dir"

# Define the list of province codes as provided
province_codes=(
  "TH10" "TH11" "TH12" "TH13" "TH14" "TH15" "TH16" "TH17" "TH18" "TH19" 
  "TH20" "TH21" "TH22" "TH23" "TH24" "TH25" "TH26" "TH27" 
  "TH30" "TH31" "TH32" "TH33" "TH34" "TH35" "TH36" "TH37" "TH38" "TH39" 
  "TH40" "TH41" "TH42" "TH43" "TH44" "TH45" "TH46" "TH47" "TH48" "TH49" 
  "TH50" "TH51" "TH52" "TH53" "TH54" "TH55" "TH56" "TH57" "TH58" 
  "TH60" "TH61" "TH62" "TH63" "TH64" "TH65" "TH66" "TH67" 
  "TH70" "TH71" "TH72" "TH73" "TH74" "TH75" "TH76" "TH77" 
  "TH80" "TH81" "TH82" "TH83" "TH84" "TH85" "TH86" 
  "TH90" "TH91" "TH92" "TH93" "TH94" "TH95" "TH96"
)

# Total number of provinces
total_provinces=${#province_codes[@]}
current_province=1

# Loop through each province code in the array
for province_code in "${province_codes[@]}"; do
    output_file="$output_dir/province_${province_code}.json"
    
    # Execute ogr2ogr command with a where clause filtering by ADM1_PCODE
    ogr2ogr -f "GeoJSON" "$output_file" "$input_file" -where "ADM1_PCODE = '$province_code'"
    
    # Check if the file was created successfully
    if [[ -f "$output_file" ]]; then
        echo "($current_province/$total_provinces) Successfully created $output_file"
    else
        echo "($current_province/$total_provinces) Failed to create $output_file"
    fi
    
    # Increment the current province counter
    ((current_province++))
done

