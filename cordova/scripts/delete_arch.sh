cd ./platforms/ios/S.\ Admin\ GoodCity/Plugins/cordova-plugin-twiliovoicesdk/TwilioVoice.framework
lipo -remove i386 TwilioVoice -o TwilioVoice
lipo -remove x86_64 TwilioVoice -o TwilioVoice
