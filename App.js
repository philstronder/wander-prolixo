import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  TouchableOpacity
} from 'react-native';
import Voice from 'react-native-voice';
import Sound from 'react-native-sound';


export default class VoiceNative extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recognized: '',
      started: '',
      results: [],
      wordCount: 0,
      wordLimit: 100,
      restarted: false
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  componentWillUnmount() {
    //Voice.destroy().then(Voice.removeAllListeners);
  }

  playSoundKiko = () => {
    if(this.state.wordCount > this.state.wordLimit) {
      // Enable playback in silence mode
      Sound.setCategory('Playback');
      var whoosh = new Sound('kiko.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

        // Play the sound with an onEnd callback
        whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });  
    } 
  }
  onSpeechStart(e) {
      this.setState({
        started: '√',
      });
  };
  onSpeechRecognized(e) {
      this.setState({
        recognized: '√',
      });
  };
  onSpeechResults(e) {
      this.setState({
        results: e.value,
        wordCount: this.state.wordCount + 1
      });
  };
  async startRecognition(e) {
    console.log("5");
      this.setState({
        recognized: '',
        started: '',
        results: [],
      });
      console.log("6");
      try {
        await Voice.start('pt-BR');
        console.log("7");
      } catch (e) {
        console.log("8");
        console.error(e);
      }
  }

  restartRecognition = (e) => {
    console.log("1");
    Voice.stop();
    console.log("2");
    this.startRecognition.bind(e);
    console.log("3");
    this.setState({wordCount: 0, restarted: true});
    console.log("4");
  }

  render () {
    let impacientText = <Text style={styles.counter}>{this.state.wordCount}</Text>;
    
    let startButton;
    
    if(!this.state.restarted) {
      startButton = <TouchableOpacity 
                      style={styles.button}
                      onPress={this.startRecognition.bind(this)}> 
                        <Text style={styles.textButton}>INICIAR</Text>
                    </TouchableOpacity>;
    } else {
      startButton = "";
    }
                      

    if(this.state.wordCount > this.state.wordLimit) {
      impacientText = <View>
                        <Text style={styles.shutUp}>CALE-SE!!!</Text>
                        <Text style={styles.finalWordCount}>
                          Você falou {this.state.wordLimit} palavras!
                        </Text>
                      </View>;

      this.playSoundKiko();
    }  

    // if(this.state.wordCount > this.state.wordLimit || this.state.restarted){
    //   startButton = <TouchableOpacity 
    //   style={styles.button}
    //   onPress={this.restartRecognition.bind(this)}> 
    //     <Text style={styles.textButton}>RECOMEÇAR</Text>
    // </TouchableOpacity>;
    // }
    
    return (
      <View style={styles.container}>
        {impacientText}   
        <View>
          {startButton}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    fontFamily: 'Comic Sans',
    backgroundColor: '#302D34',
    height: 60,
    zIndex: 0,
    width: 160,
    textAlign: 'center',
    marginTop: '80%',
    borderRadius: 25 
  },
  textButton: {
    fontSize: 32,
    color: '#FFF',
    zIndex: 100,
    textAlign: 'center',
    paddingTop: '10%',
    fontFamily: 'DIN Condensed'
  },
  container: {
    backgroundColor: '#4F40BE',
    height: '100%',
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: '50%',
    top: '400%',
  },
  shutUp: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 70,
    fontFamily: 'DIN Condensed'
  },
  finalWordCount: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'DIN Condensed'
  },
  counter: {
    fontSize: 72,
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'DIN Condensed'
  }
});

AppRegistry.registerComponent('VoiceNative', () => VoiceNative);