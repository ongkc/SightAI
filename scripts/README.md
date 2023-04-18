## Script to generate signature

### Prerequisites
```
1) cd into scripts folder
2) pip install -r requirements.txt
```
### Command Line to run the script

#### Required Argument:
Please update the username and password accordingly
```
python3 generate-signature.py --username "username" --password "password"
```
#### Optional Arguments:
```
Options: --signin-url, --generate-signature-url, --image-path

Example:
python3 generate-signature.py --username user1 --password password1 --signin-url signin --generate-signature-url generature-signature-url --image-path image.png
```
#### Generated Signatures
```
Signature Generated will be shown in the command line and in the signature.log file as well.
```