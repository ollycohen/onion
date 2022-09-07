const studio = `
<div class="container section" id="studio">
    <a class="onion-text" target="_blank" href="https://goo.gl/maps/WjSqwvhFEwCmNScv6">
        <img id="studio-img" src="/assets/studio.jpeg"/>
    </a>
</div>
`

const artist = `
    <div class="container section" id="artist">
        <br><br>
        <div class="row">
            <div class="artist-div col-sm-6">
                <a target="_blank" href="https://linktr.ee/thingthething">
                <img class="artist-img" src="/assets/thing.png"/>
                </a>
            </div>
            <div class="artist-div col-sm-6">
                <a target="_blank" href="https://linktr.ee/tenniscourts">
                <img href="https://linktr.ee/tenniscourts" class="artist-img" src="/assets/tenniscourts.png"/>
                </a>
            </div>
        </div>
    </div>`

const about = `<div class="container section" id="about">
    <div class="onion-text" id="bio">
        <p>
            Onion Records is a boutique studio and label in East Williamsburg, Brooklyn. We produce timeless analog music and specialize in band recording.
         </p>
        <!-- <p>We are looking for projects that are aiming to get across a feeling rather than certain sonic qualities. There is something to be said about imperfections in a song and not having things too polished. We love the rock & roll attitude and believe that what you capture in the moment is special and not to be tampered with. A voice memo can have more feel than a song recorded in the best quality studio. If you are willing to work and take risks, then take a chance on us. Let’s make some magic! </p> -->
        <p>
        <b>Our services:</b> Full Band Recordings & Overdubbing, Rehearsal Space, Voice Over Dialogue, Advertising Projects, Video & Photography, and Mixing. Clients can work with in-house engineers or operate the studio with certified personnel. 
        </p>
        <p>
        Contact us at 
        <a class="onion-text" href="mailto:onionrecords@gmail.com">onionrecords@gmail.com</a>.
        </p>
    </div>
</div`

sectionTitleToBodyMap = {
    "studio" : studio,
    "artist" : artist,
    "about" : about
}


function showSection(sectionToShow){
    // Change the Section Body
    $("#sections-block").html(sectionTitleToBodyMap[sectionToShow])
    // Make the correct section title bold
    $("#menu").children().each(function(){
        var curId =  $(this).attr('id').slice(0,-4)
        if (sectionToShow == curId){
            $("#"+curId+"-btn").css('font-weight','bolder')
        }else{
            $("#"+curId+"-btn").css('font-weight','normal')
        }
    })
    
}

$(window).on('load', function(){
    var sectionToShow = "studio"
    showSection(sectionToShow)
})

$(document).on('click', '.menu-item', function (){
    var clickedId = $(this).attr('id').slice(0,-4);
    showSection(clickedId)
})

