(() => {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
})();

// シグナリングサーバーへ接続する
// key にはSkyWayを利用するためのAPI Keyを指定する
// https://skyway.io/ds/registration/ から無料で登録申請できる
var peer = new Peer({ key: 'ca0da7a2-a914-4d0a-8c4c-93691a52317f', debug: 3});

var localStream;
var existingCall;

var Component = React.createClass({
  getInitialState() {
    return {
      myId: '',
      peerId: '',
      calleeValue: ''
    };
  },
  componentDidMount() {
    //シグナリングサーバへの接続が確立したときの処理
    peer.on('open', () => {
      this.setState({
        myId: peer.id
      });
    });

    // リモートから発信を受けたときの処理
    peer.on('call', (call) => {
      // 自分のストリームを渡す
      call.answer(localStream);

      // リモートのビデオを表示
      this.showPeerVideo(call);
    });

    this.showMyVideo();

    //let myVideo = $('#my-video');
    //myVideo.jrumble({
    //  x: 10,
    //  y: 10,
    //  rotation: 4,
    //  speed: 70
    //});
    //myVideo.trigger('startRumble');
    //let peerVideo = $('#peer-video');
    //peerVideo.jrumble({
    //  x: 10,
    //  y: 10,
    //  rotation: 4,
    //  speed: 70
    //});
    //peerVideo.trigger('startRumble');
  },
  makeCall() {
    var calleeId = this.state.calleeValue;

    //相手に自分のストリームを渡す
    var call = peer.call(calleeId, localStream);

    this.showPeerVideo(call);
  },
  endCall() {
    existingCall.close();
  },
  calleeChange(e) {
    this.setState({
      calleeValue: e.target.value
    });
  },
  showMyVideo() {
    // 音声・ビデオストリームを取得
    navigator.getUserMedia({audio: true, video: true}, (stream) => {
      // コールバックにストリームが渡されるので、オブジェクトURLを生成し、
      // videoタグのsrcにセットする
      $(this.refs.myVideo.getDOMNode()).prop('src', URL.createObjectURL(stream));
      this.refs.myVideo.getDOMNode().play();

      localStream = stream;

    }, () => {
      console.log(Error);
    });
  },
  showPeerVideo(call) {
    // 相手のストリームが渡されたときの処理
    call.on('stream', (stream) => {
      // 映像ストリームオブジェクト stream をURL.createObjectURL を用い
      // URLに変換した後、video 要素の src 属性に指定することで、映像が表示される
      $(this.refs.peerVideo.getDOMNode()).prop('src', URL.createObjectURL(stream));
      this.refs.peerVideo.getDOMNode().play();
    });

    existingCall = call;

    this.setState({
      peerId: call.peer
    });
  },
  render() {
    return (
      <div>
        <h1>WebRTC(Skyway) Video Chat</h1>

        <div id="video-container">
          <video id="my-video" className="my-video" ref="myVideo" muted="true" width="400px" autoplay></video>
          <video id="peer-video" className="peer-video" ref="peerVideo" width="400px" autoplay></video>
        </div>

        <div>
          <p>Your ID: {this.state.myId}</p>
          <p>Callee ID: {this.state.peerId}</p>
        </div>

        <div>
          <p>
            <input type="text" className="text" placeholder="input user id ..." onChange={this.calleeChange} />
          </p>
          <p>
            <button id="hoge" className="button" onClick={this.makeCall}>Call button</button>
            <button className="button" onClick={this.endCall}>End call button</button>
          </p>
        </div>
      </div>
    );
  }
});

var component = React.render(
  <Component />,
  document.getElementById('component')
);

