app.init.dom = function(app){
    
    $(document).ready(function(){

        // $metronome = $('#metronome')
        app.$beatBoxes = $('.beatBox')
        app.$loopTracks = $('.loop-track')

        var start;
        var animateFrame = function(){
            var now = performance.now()
            var beatsPerLoop = app.beatsPerBar * app.barsPerLoop
            var progressInBeat = ( ( ( now - start ) % app.beatLen ) / app.beatLen )
            var progressInLoop = ( ( ( now - start ) % ( app.beatLen * beatsPerLoop ) ) / ( app.beatLen * beatsPerLoop ) )
            // console.log(Math.floor(progressInLoop / 0.0625) + 1)
            app.prevBeat = app.curBeat
            app.curBeat = Math.floor(progressInLoop / 0.0625) + 1
            if ( app.curBeat < app.prevBeat ) {
                console.log('fire!')
            }
            if      ( Math.floor(progressInLoop / 0.0625) > 0 ) {
                $(app.$beatBoxes[ Math.floor(progressInLoop / 0.0625) ]).addClass('on')
                $(app.$beatBoxes[ Math.floor(progressInLoop / 0.0625) - 1 ]).removeClass('on')
            }
            else if ( Math.floor(progressInLoop / 0.0625) === 0 ) {
                var end = app.$beatBoxes.length - 1
                $(app.$beatBoxes[0]).addClass('on')
                $(app.$beatBoxes[end]).removeClass('on')
            }


            requestAnimationFrame(animateFrame)
        }



        $('#start').on('click', function(){
            $('.beatBox').removeClass('on')
            $(this).find('i').removeClass('fa-play-circle-o')
            $(this).find('i').addClass('fa-undo')
            start = performance.now() -16000
            animateFrame()
        })


        $('#micOn').on('click', function(){
            if ( !($('#ban').hasClass('fa-ban')) ) {
                $('#ban').addClass('fa-ban')
                app.instruments.voice.stop()
            }
            else {
                $('#ban').removeClass('fa-ban')
                app.instruments.voice.play()
            }
        })

        $(document).on('keyup', function(e){
           if ( app.keys.record.indexOf(e.which) > -1 ){
               app.keys.mode.record = false;
               console.log(app.keys.mode)
           } 
        })

        $(document).on('keydown', function(e){
            console.log(e)
            // if ( e.which === 32 || e.metaKey === true ) { e.preventDefault(); }
            if ( app.keys.record.indexOf(e.which) > -1 ){
                app.keys.mode.record = true;
               console.log(app.keys.mode)
            }

            if ( e.which >= 49 && e.which <= 56 ) { //pressed a number key for multi-track mixer
                e.preventDefault();

                if ( app.keys.mode.schedule === false ) {

                    if ( app.keys.mode.record === true ) {
                        app.trackActions.recordToTrack(e.which - 49)
                    }
                    else if ( app.keys.mode.record === false) {
                        console.log('mute!')
                        app.trackActions.muteTrack(e.which - 49)
                    }

                }
            }
        })

        $('.note').on('mousedown', function(){
            console.log('hi')
            app.instruments.alpha.play()
        })
        $('.note').on('mouseup', function(){
            app.instruments.alpha.stop()
        })

        $('.timing-settings input[type="range"]').on('change', function(){
            var thisName = $(this).attr('name')
            $('[for="' + thisName + '"]').text($(this).val())

        })
        $('[name="save"]').on('click', function(){
            var bpm         = $('[name="bpm"]').val()
            var beatsPerBar = $('[name="beats-per-bar"]').val()
            var barsPerLoop = $('[name="bars-per-loop"]').val()
            console.log(bpm,beatsPerBar,barsPerLoop)
            app.trackActions.resizeLoop(bpm, beatsPerBar, barsPerLoop)
        })

    })
}