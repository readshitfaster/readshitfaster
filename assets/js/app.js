//sets default settings
var increments = null,
    readIndex = 0,
    stonks = [],
    settings = {
        speed: 225,
    };
function prepare(text) {
    stonks = [];

    var lines = text.split('\n'),
        words = [];
    for(i = 0; i < lines.length; i++) {
        var lineWords = lines[i].split(' ');
        for(i2 = 0; i2 < lineWords.length; i2++) {
            if(lineWords[i2] !== '') {
                var trimmedWord = $('<div />').text($.trim(lineWords[i2])).html();
                words.push(trimmedWord);
            }
        }
    }
    var combined = false,
        dotPattern = /.*\./;
    for(i = 0; i < words.length; i++) {
        if(word !== '') {
            var didSentenceEnd = false;
            if(words[i].match(dotPattern)) {
                didSentenceEnd = true;
            }
            if(settings.combine && words[i].length <= 3 && !combined && i > 0) {
                var index = stonks.length - 1;
                stonks[index].text += ' ' + words[i];
                stonks[index].sentenceEnd = didSentenceEnd;
                combined = true;
            } else {
                stonks.push({text: words[i], sentenceEnd: didSentenceEnd});
                combined = false;
            }
        }
    }
    $('#text-info').html(words.length + ' words').show();
    $('body').data('prepared', true);
}
function start() {
    if(stonks.length === 0) {
        return false;
    }
    interval = 1000 / (settings.speed / 60);
    increments = window.setInterval(flashWords, interval, stonks);
    $('#start').html('Pause');
    $('body').data('reading', true);

    window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  }, false);
}
function stop() {
    window.clearInterval(increments);
    $('#start').html('Read!');
    $('body').data('reading', false);
}
function flashWords(array) {
    var chunk = array[readIndex],
        length = array.length;
    if(readIndex == length) {
        stop();
        readIndex = 0;
    } else {
        readIndex++;
    }
    $('#word').html(chunk.text);
    $('#progress').attr({
        'max': stonks.length,
        'value': readIndex,
        'step': 1
    }).show();
}
function savesettings() {
    localStorage.setItem('settings', JSON.stringify(settings));
}

//generates a random article from one of these 3
function randomArticle() {
  idArray = new Array()
  idArray [1] = "Acknowledging that some of his clients have to overcome some initial hesitation, cognitive therapist Dr. Daniel Boyer spoke Monday regarding his innovative technique of simply allowing his patients to beat the living shit out of him for 45 minutes. “Sometimes I fight back at first, but it’s important for my clients to feel like they’re making progress, so I usually just let them go to town until I tap out or the session ends,” said Boyer, who often provides patients with a pillow and encourages them to place it over his face while hitting him for the duration of their appointment. “Many people need a bit of coaxing to feel like they can open up and express themselves, but once I set the mood by shouting long lists of things they hate about themselves or bringing up some childhood trauma or deep-seated pain, they eventually start whaling on me. It’s especially great for couples counseling. Two people working together to hold me down and punch me in the stomach? That’s a beautiful thing. That’s why I got into this business.” Boyer usually concludes each session by sliding a tissue box over to his patients so they can wipe his splattered blood from their faces. Source: The Onion"

  idArray [2] = "In an unexpected interruption of the night’s scheduled DNC debate programming, a naked and visibly agitated Andrew Yang ecombined from the howling chaos of an irising time vortex Thursday to warn the debate audience about the looming threat of automation. “Arm yourselves, citizens, and keep your courage and your wits about you, for our clash with the mechanical sapients draws nigh!” said the frantic entrepreneur and 2020 Democratic presidential candidate, who did not so much as pause to wait for the stray tendrils of blue lightning to fade from coursing over his otherwise nude body before striding to his designated podium and delivering a stirring speech about the grave consequences faced by mankind if they failed to take action and prevent the coming war. “My fellow citizen-humans, I have seen horrors upon horrors birthed from the cold and antiseptic womb of automation. Our world has become a different place, a place of implacable mathematical deduction, an emotionless vacuum of pure logic, a crystalline Libertarian ideal realm where mankind has been reduced to the servants, living curios, and even pets of the robotoid over-race. I’ve seen welding arms burn men where they stand, manipulator armatures disassemble screaming children with analytical precision, relentless tracks grind fleeing women and their contraband infants into their own bloody footprints. And that automated nightmare grew from seeds sown in our own time—we must take action now, before we are forced to take up arms to fight the unconquerable!” The debate was further interrupted by a hydraulic chrome Andrew Yang emerging from the vortex to denounce the previous Yang as a lying imposter. Source: The Onion"

  idArray [3] = "Emphasizing that a few pieces are even from a difficult single-color section comprising “practically nothing but empty blue sky,” Caitlin Roth, 34, was exhilarated Thursday to discover that the previous person to use the jigsaw puzzle at her Airbnb had left “a ton” of pieces sticking together. “Holy shit, like, half of the red barn is done already! Yeah, baby!” said Roth upon realizing she had a 60 to 80 piece head start on the 500-piece farm tableau. “It’s not even just edges. There’s a bunch of middle stuff in place, too! God, these little grass sections would’ve been tricky because there really aren’t a whole lot of defining features. All I’m left with is the tractor, the horse, and the little birds up top, and then honestly, I can just coast. How fucking lucky am I, huh?” Roth later gave up after spending roughly 15 minutes attempting to complete the puzzle. Source: The Onion"

  document.getElementById("random-article").onclick = randomArticle;
  randomParagraph = Math.floor(Math.random()*3);

  document.getElementById("readable").innerHTML = idArray[randomParagraph + 1];
}
//make sticky note fade away on click
$(document).ready(function(){
  $(".fade").click(function(){
    $("#hideSticky").fadeOut();
  });
});

$(document).ready(function() {
    if(localStorage.getItem('settings') === null) {
        localStorage.setItem('settings', JSON.stringify(settings));
    } else {
        settings = JSON.parse(localStorage.getItem('settings'));
    }
    $('body').data({'reading': false, 'prepared': false});
    prepare($('#readable').val());


    $('#start').on('click', function() {
        var data = $('body').data();
        if(data.reading === false) {
            if(data.prepared === false) {
                var text = $('#readable').val();
                settings.speed = parseInt($('#reading-speed').val());
                if(text.length > 1 && settings.speed > 0) {
                    prepare(text);
                } else {
                    alert('No text to read (or invalid speed settings)');
                }
            }
            $('#readable').fadeOut(250, function() {
                start();
                $('#reading-screen, #new, #restart').fadeIn(250);
            });
            $('h1').animate({height: 0, opacity: 0}, 500);
            $('#other').fadeOut(500);
            $('#random-article').fadeOut(500);
            $('#combine').attr('disabled', true).parent().css('opacity', 0.5);
        } else {
            stop();
        }
    });

    $('#restart').on('click', function() {
      if($('body').data().reading === true) {
          if(readIndex < 7) {
              readIndex = 0;
          } else {
              readIndex = readIndex - readIndex;
          }
          $('#word').html(chunks[readIndex].text);
          $('#progress').val(readIndex);
      }
    });

    $('#readable').on('keyup', function() {
        readIndex = 0;
        prepare($(this).val())
    });

    $('#reading-speed').on('change', function() {
        settings.speed = parseInt($(this).val());
        console.log(settings.speed)
        savesettings();
        if($('body').data('reading') === true) {
            stop();
            start();
        }
    });

    $('#progress').on('mousedown touchstart', function() {
        if($('body').data('reading')) {
            stop();
            $('body').data('reading', 'paused');
        }
        $(this).on('mousemove touchmove', function() {
            var newIndex = $(this).val();
            $('#word').html(stonks[newIndex].text);

        });
    }).on('mouseup touchend', function() {
        readIndex = $(this).val();
        $(this).off('mousemove');
        if($('body').data('reading') === 'paused') {
            start();
        }
    });
    //key controls
        $('body').on('keyup', function(e) {
            console.log(e.keyCode)
            if($('#readable').is(':focus')) {
                return false;
            }
            //spacebar will pause/play
            if(e.keyCode == 32) {
                if($('body').data('reading') === true) {
                    stop();
                } else {
                    start();
                }
            //up arrow increases wpm by 5
            } else if(e.keyCode == 38) {
                $('#reading-speed').val(settings.speed + 5).trigger('change');
            //down arrow decreases wpm by 5
            } else if(e.keyCode == 40) {
                $('#reading-speed').val(settings.speed - 5).trigger('change');
            //backspace left arrow, goes back 7 words
            } else if(e.keyCode == 8 || e.keyCode == 37) {
                if($('body').data().reading === true) {
                    if(readIndex < 7) {
                        readIndex = 0;
                    } else {
                        readIndex = readIndex - 7;
                    }
                    $('#word').html(chunks[readIndex].text);
                    $('#progress').val(readIndex);
                }

            }
        });

    $('#new').on('click', function() {
        $('#reading-screen').hide();
        $('#restart').fadeOut();
        $('#readable, #other, #random-article').fadeIn(500);
        $('h1').animate({height: '26px', opacity: 1}, 500);
        $(this).fadeOut(500);
        if($('body').data('reading') === true) {
            stop();
        }
    })
});
