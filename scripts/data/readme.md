# Data

This folder contains 6 csv files which have 6 different datasets. All datasets are obtained from open Github repos and they were provided by researchers who work in related areas.

## Source: https://github.com/t-davidson/hate-speech-and-offensive-language
Paper: https://aaai.org/ocs/index.php/ICWSM/ICWSM17/paper/view/15665

### labeled_data.csv

This file contains the labeled dataset proveded by davidson. It contains three classes: hate speech, aggressive language and neither. Labels are annotated manually with a group of people.

## Source: https://github.com/ENCASEH2020/hatespeech-twitter
Paper: https://arxiv.org/pdf/1802.00393.pdf

### hatespeech.csv
This file contains the labeled dataset with twitter context downloaded from Twitter. Only currently downloadable tweets exist in this file. The labels are classified as hateful, abusive, spam and normal.
### hatespeech2.csv
Based on hatespeech.csv, but change the classification into binary form (only normal and bad).
### hatespeech2nospam.csv
Based on hatespeech.csv, change the classification into binary form and remove spam data entries.
### combined_data.csv
A combination of labeled_data.csv and hatespeech2nospam.csv.

## Source: https://github.com/HKUST-KnowComp/MLMA_hate_speech
Paper: https://arxiv.org/pdf/1908.11049.pdf

### fr_dataset.csv
A french dataset might be useful. However, this dataset has more than 60 different labels and thus not yet used.