# This Rakefile assists in creating Cordova app builds. It provides a consistent
# build process on dev machines, CI servers and is cross-platform.
#
# Tasks overview
#   rake app:build (default)
#   rake app:deploy (upload to TestFairy; also upload to Azure storage for live builds)
#   rake app:release (build and upload to TestFairy; also upload to Azure storage for live builds)
#
# Defaults:
#   ENV=staging PLATFORM=<based on host machine: darwin -> ios, linux -> android>
#
# Advanced usage
#   Specify ENVIRONMENT params or call special task
#     > rake android production app:build
#     > ENV=production PLATFORM=android rake app:build (equivalant to above)
#   Other tasks
#     > rake clean (removes dist, cordova/www and app files)
#     > rake clobber (also removes cordova/platforms and cordova/plugins)
#     > rake cordova:install
#     > rake cordova:prepare
#     > rake cordova:build
#
#     Cronjob entry
# * * * * * source /Users/developer/.bash_profile; rake -f /Users/developer/Workspace/admin.goodcity/Rakefile app:release  >> /tmp/goodcity_admin_ios_build.log 2>&1
#
# Signing Android releases
#   Gradle can sign the releases during the build process.
#   Set environment varibles: GOODCITY_KEYSTORE_PASSWORD and GOODCITY_KEYSTORE_ALIAS
#   You must also ensure the signing key exists at CORDOVA/goodcity.keystore

require "json"
require "fileutils"
require "rake/clean"
require 'plist'

ROOT_PATH = File.dirname(__FILE__)
CORDOVA_PATH = "#{ROOT_PATH}/cordova"
CLEAN.include("dist", "cordova/www", "#{CORDOVA_PATH}/platforms/android/build",
  "#{CORDOVA_PATH}/platforms/ios/build")
CLOBBER.include("cordova/platforms", "cordova/plugins")
PLATFORMS = %w(android ios windows).freeze
ENVIRONMENTS = %w(staging production).freeze
TESTFAIRY_PLATFORMS=%w(android ios)
SHARED_REPO = "https://github.com/crossroads/shared.goodcity.git"
TESTFAIRY_PLUGIN_URL = "https://github.com/testfairy/testfairy-cordova-plugin"
TESTFAIRY_PLUGIN_NAME = "com.testfairy.cordova-plugin"
SPLUNKMINT_PLUGIN_URL = "https://github.com/crossroads/cordova-plugin-splunkmint.git"
KEYSTORE_FILE = "#{CORDOVA_PATH}/goodcity.keystore"
BUILD_JSON_FILE = "#{CORDOVA_PATH}/build.json"

# Default task
task default: %w(app:build)

# Main namespace
namespace :app do
  desc "Builds the app"
  task build: %w(cordova:prepare cordova:build)
  desc "Uploads the app to TestFairy and Azure storage"
  task deploy: %w(testfairy:upload azure:upload)
  desc "Equivalent to rake app:build app:deploy"
  task release: %w(app:build testfairy:upload azure:upload)
end

ENVIRONMENTS.each do |env|
  task env do
    ENV["ENV"] = env
  end
end

PLATFORMS.each do |platform|
  task platform do
    ENV["PLATFORM"] = platform
  end
end

namespace :cordova do
  desc "Cordova prepare {platform}"
  task :prepare do
    create_build_json_file
    sh %{ ln -s "#{ROOT_PATH}/dist" "#{CORDOVA_PATH}/www" } unless File.exists?("#{CORDOVA_PATH}/www")
    build_details.map{|key, value| log("#{key.upcase}: #{value}")}
    sh %{ cd #{CORDOVA_PATH}; cordova-update-config --appname "#{app_name}" --appid #{app_id} --appversion #{app_version} }

    log("Preparing app for #{platform}")
    Dir.chdir(CORDOVA_PATH) do
      system({"ENVIRONMENT" => environment}, "cordova prepare #{platform}")
      unless platform == "ios"
        sh %{ cordova plugin add #{SPLUNKMINT_PLUGIN_URL} --variable MINT_APIKEY="#{splunk_mint_key}" }
        sh %{ cordova plugin add cordova-android-support-gradle-release --variable ANDROID_SUPPORT_VERSION=27 }
      end
    end
    if platform == "ios"
      Dir.chdir(CORDOVA_PATH) do
        sh %{ cordova plugin add #{TESTFAIRY_PLUGIN_URL} } if environment == "staging"
        sh %{ cordova plugin remove #{TESTFAIRY_PLUGIN_NAME}; true } if environment == "production"
      end
    end
  end
  desc "Cordova build {platform}"
  task build: :prepare do
    Dir.chdir(CORDOVA_PATH) do
      build = (environment == "staging" && platform == 'android') ? "debug" : "release"
      extra_params = (platform === "android") ? '' : ios_build_config
      system({"ENVIRONMENT" => environment}, "cordova compile #{platform} --#{build} --device #{extra_params}")
    end
  end
end

namespace :testfairy do
  task :upload do
    return unless TESTFAIRY_PLATFORMS.include?(platform)
    raise(BuildError, "#{app_file} does not exist!") unless File.exists?(app_file)
    raise(BuildError, "TESTFAIRY_API_KEY not set.") unless env?("TESTFAIRY_API_KEY")
    if ENV["CI"]
      sh %{ source ~/.circlerc; #{testfairy_upload_script} "#{app_file}" }
    else
      sh %{ #{testfairy_upload_script} "#{app_file}" }
    end
    log("Uploaded app...")
    build_details.map{|key, value| log("#{key.upcase}: #{value}")}
  end
end

namespace :azure do
  task :upload do
    if environment != "production"
      log("Environment: #{environment}. Skipping Azure upload")
      next
    end
    raise(BuildError, "#{app_file} does not exist!") unless File.exists?(app_file)
    raise(BuildError, "AZURE_HOST not set.") unless env?("AZURE_HOST")
    raise(BuildError, "AZURE_SHARE not set.") unless env?("AZURE_SHARE")
    raise(BuildError, "AZURE_SAS_TOKEN not set.") unless env?("AZURE_SAS_TOKEN")
    if ENV["CI"]
      sh %{ source ~/.circlerc; PATH=$(npm bin):$PATH; azure-filestore upload -d #{platform} -f "#{app_file}" -t #{azure_file} }
    end
    log("Uploaded app to azure...")
    build_details.map{|key, value| log("#{key.upcase}: #{value}")}
  end
end

# SPLUNK_MINT_KEY_ADMIN_IOS_STAGING
# SPLUNK_MINT_KEY_ADMIN_IOS_PRODUCTION
# SPLUNK_MINT_KEY_ADMIN_ANDROID_STAGING
# SPLUNK_MINT_KEY_ADMIN_ANDROID_PRODUCTION
def splunk_mint_key
  key = "SPLUNK_MINT_KEY_ADMIN_#{platform}_#{environment}".upcase
  ENV[key]
end

def app_sha
  Dir.chdir(ROOT_PATH) do
    `git rev-parse --short HEAD`.chomp
  end
end

def app_shared_sha
  @app_shared_sha ||= begin
    branch = nil
    Dir.chdir(ROOT_PATH) do
      branch = `git rev-parse --abbrev-ref HEAD`.strip
    end
    sha = `git ls-remote --heads #{SHARED_REPO} #{branch}`.strip
    sha = `git ls-remote --heads #{SHARED_REPO} master`.strip if sha.empty?
    sha[0..6]
  end
end

def environment
  environment = ENV["ENV"]
  raise(BuildError, "Unsupported environment: #{environment}") if (environment || "").length > 0 and !ENVIRONMENTS.include?(environment)
  ENV["ENV"] || "staging"
end

def platform
  env_platform = ENV["PLATFORM"]
  raise(BuildError, "Unsupported platform: #{env_platform}") if (env_platform || "").length > 0 and !PLATFORMS.include?(env_platform)
  env_platform || begin
    case Gem::Platform.local.os
    when /mswin|windows|mingw32/i
      "windows"
    when /linux|arch/i
      "android"
    when /darwin/i
      "ios"
    else
      raise(BuildError, "Unsupported build os: #{env_platform}")
    end
  end
end

def env?(env)
  (ENV[env] || "") != ""
end

def app_file
  case platform
  when /ios/
    "#{CORDOVA_PATH}/platforms/ios/build/device/#{app_name}.ipa"
  when /android/
    build = is_staging ? "debug" : "release"
    "#{CORDOVA_PATH}/platforms/android/build/outputs/apk/android-#{build}.apk"
  when /windows/
    raise(BuildError, "Need to get Windows app path")
  end
end

def azure_file
  case platform
  when /ios/
    extn = "ipa"
  when /android/
    extn = "apk"
  end
  "#{app_id}-#{app_version}.#{extn}"
end

def app_name
  is_staging ? "S. Admin GoodCity" : "Admin GoodCity"
end

def app_id
  is_staging ? "hk.goodcity.adminstaging" : "hk.goodcity.admin"
end

def app_version
  if ENV["CI"]
    is_staging ? "#{ENV['APP_VERSION']}.#{ENV['CIRCLE_BUILD_NUM']||ENV['BUILD_BUILDNUMBER']}" : ENV['APP_VERSION']
  elsif @ver
    @ver
  else
    print "Enter GoodCity app version: "
    @ver = STDIN.gets.strip
  end
end

def mobile_provisioning_file
  prefix = ['~', 'Library', 'MobileDevice', 'Provisioning\ Profiles']
  file = if production_env?
      "GoodCity_Admin.mobileprovision"
    else
      "GoodCity_Admin_Staging.mobileprovision"
    end
  File.join(prefix, file)
end

def mobile_provisioning_plist
  @mobile_provisioning_plist ||= begin
    profile = `openssl smime -inform der -verify -noverify -in #{mobile_provisioning_file}`
    Plist.parse_xml(profile)
  end
end

def ios_build_config
  opts = {}
  opts["developmentTeam"] = mobile_provisioning_plist["TeamIdentifier"].first
  opts["automaticProvisionin"] = false
  opts["buildFlag"] = '-UseModernBuildSystem=0'
  opts["provisioningProfile"] = mobile_provisioning_plist["UUID"]
  if production_env?
    opts["codeSignIdentity"] = "\'iPhone Distribution\'"
    opts["packageType"] = "app-store"
    opts["icloud_container_environment"] = "Production"
  else
    opts["codeSignIdentity"] = "\'iPhone Developer\'"
    opts["packageType"] = 'development'
    opts["icloud_container_environment"] = "Development"
  end
  opts.map do |key, value|
    "--#{key}=#{value}"
  end.join(" ")
  #" --codeSignIdentity=#{code_signing} --developmentTeam=#{team_id} --packageType=#{package_type} --provisioningProfile=\'#{provisioning_profile}\' --automaticProvisionin=#{signing_style} --icloud_container_environment=#{icloud_container_environment}"
end

def production_env?
  environment == 'production'
end

def testfairy_upload_script
  "#{CORDOVA_PATH}/deploy/testfairy-#{platform}-upload.sh"
end

def is_staging
  environment == "staging"
end

def build_details
  {app_name: app_name, env: environment, platform: platform, app_version: app_version}
end

def log(msg="")
  puts(Time.now.to_s << " " << msg)
end

# Cordova uses build.json to create gradle release-signing.properties file
# Expects CORDOVA_PATH/goodcity.keystore to exist
# Requires ENV vars: GOODCITY_KEYSTORE_PASSWORD and GOODCITY_KEYSTORE_ALIAS
def create_build_json_file
  FileUtils.rm(BUILD_JSON_FILE) if File.exists?(BUILD_JSON_FILE)
  return unless (environment == "production" and platform == "android")
  raise(BuildError, "Keystore file not found: #{KEYSTORE_FILE}") unless File.exists?("#{KEYSTORE_FILE}")
  %w(GOODCITY_KEYSTORE_PASSWORD GOODCITY_KEYSTORE_ALIAS).each do |key|
    raise(BuildError, "#{key} environment variable not set.") unless env?(key)
  end
  build_json_hash = {
    android: {
      release: {
        keystore: "#{KEYSTORE_FILE}",
        storePassword: ENV["GOODCITY_KEYSTORE_PASSWORD"],
        alias: ENV["GOODCITY_KEYSTORE_ALIAS"],
        password: ENV["GOODCITY_KEYSTORE_PASSWORD"]
      }
    }
  }
  File.open(BUILD_JSON_FILE, "w"){|f| f.puts JSON.pretty_generate(build_json_hash)}
end

class BuildError < StandardError; end
