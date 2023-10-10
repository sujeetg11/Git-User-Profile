document.addEventListener('DOMContentLoaded', function() {
    var myForm = document.getElementById('myForm');
    var ghapidata = document.getElementById('ghapidata');
    var ghusername = document.getElementById('ghusername');
    var loader = document.getElementById('loader');

    myForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // loader.style.display = 'block';
        setTimeout(function() {
        ghapidata.innerHTML = '<div id="loader"><img src="sliding_square_loader_view.gif" alt="loading..."></div>';
        

        var username = ghusername.value;
        var requri = 'https://api.github.com/users/' + username;
        var repouri = 'https://api.github.com/users/' + username + '/repos';

        requestJSON(requri, function(json) {
            if (json.message == "Not Found" || username == '') {
                ghapidata.innerHTML = "<h2>No User Info Found</h2>";
            } else {
                var fullname = json.name || username;
                var aviurl = json.avatar_url;
                var profileurl = json.html_url;
                var location = json.location;
                var followersnum = json.followers;
                var followingnum = json.following;
                var reposnum = json.public_repos;

                var outhtml = '<h2>' + fullname + ' <span class="smallname">(@<a href="' + profileurl + '" target="_blank">' + username + '</a>)</span></h2>';
                outhtml += '<div class="ghcontent"><div class="avi"><a href="' + profileurl + '" target="_blank"><img src="' + aviurl + '" width="80" height="80" alt="' + username + '"></a></div>';
                outhtml += '<p>Followers: ' + followersnum + ' - Following: ' + followingnum + '<br>Repos: ' + reposnum + '</p></div>';
                outhtml += '<div class="repolist clearfix">';

                var repositories;
                requestJSON(repouri, function(json) {

                    // setTimeout(function() {
                    //     loader.style.display = 'none'; // Hide the loader after data is loaded
                    //     ghapidata.innerHTML = outhtml; // Populate the content
                    //     }, 1000);

                    
                    repositories = json;
                    outputPageContent();

                });

                function outputPageContent() {
                    
                    if (repositories.length === 0) {
                        outhtml += '<p>No repos!</p></div>';
                    } else {
                        outhtml += '<p><strong>Repos List:</strong></p> <ul>';
                        repositories.forEach(function(repo) {
                            outhtml += '<li><a href="' + repo.html_url + '" target="_blank">' + repo.name + '</a></li>';
                        });
                        outhtml += '</ul></div>';
                    }
                    ghapidata.innerHTML = outhtml;
                }
            }
        });
    }, 3000);
    });

    function requestJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                callback.call(null, json);
            }
        };
        xhr.send();
    }
});
