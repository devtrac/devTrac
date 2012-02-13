describe("site.upload" ,function(){
	var siteUpload;
	beforeEach(function(){
		var fixture = " <div id='site_list' class='grid'>" +
    	"<div class='grid_row'>" +
    	"<input type='checkbox' id='1_upload' >site1</input>" +
			"<input type='checkbox' id='2_upload' >site2</input>" +
    	"</div>"+
		"</div>";
		setFixtures(fixture);

		siteUpload = new SiteUpload();
	});

	describe("prepare", function(){
		it("update site's upload attr according to the checkbox's status",function(){
			var sites = [{id:1,upload:false}, {id:2,upload:false}];
			$("#1_upload").attr("checked",true);

			siteUpload.prepare(sites);

			expect(sites[0].upload).toEqual(true);
		 	expect(sites[1].upload).toEqual(false);
		});
	});

	describe("unchecked", function(){
		it("return false if the site is checked", function(){
			var sites = [{id:1,upload:false}, {id:2,upload:false}]
			$("#1_upload").attr("checked",true);
			siteUpload.prepare(sites);

			expect(siteUpload.unchecked(sites[0])).toEqual(false);
		})

		it("return true if the site is not checked", function(){
			var sites = [{id:1,upload:false}, {id:2,upload:false}];
			$("#1_upload").attr("checked",true);
			siteUpload.prepare(sites);

			expect(siteUpload.unchecked(sites[1])).toEqual(true);
		})
	})
});
