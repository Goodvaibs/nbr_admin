 $(document).ready(function () {

    var base_url = "http://konkannotri.local/en/";

    $(".community_listing").ready(function () {

        var country_name = $(this).attr('data-country');

        $.ajax({
            type: "POST",
            url: base_url+"community/ajax_community_members_listing/"+country_name;
            dataType:"json"
            success: function () {
                
            }
        });
    });
});