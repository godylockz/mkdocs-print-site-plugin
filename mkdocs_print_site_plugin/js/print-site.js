/* 
Javascript functions to help make the print page more PDF friendly
*/

/*
Generates a table of contents for the print site page.
Only called when print-site-plugin option 'add_table_of_contents' is set to true
*/
function generate_toc() {

  var ToC = ""

  var newLine, el, title, link;

  const toc_elements = document.querySelectorAll(
    "#print-site-page h1.nav-section-title, #print-site-page h1.nav-section-title-end," +
    "#print-site-page h2.nav-section-title, #print-site-page h2.nav-section-title-end," +
    "#print-site-page h3.nav-section-title, #print-site-page h3.nav-section-title-end," +
    "#print-site-page h4.nav-section-title, #print-site-page h4.nav-section-title-end," +
    "#print-site-page h5.nav-section-title, #print-site-page h5.nav-section-title-end," +
    "#print-site-page h6.nav-section-title, #print-site-page h6.nav-section-title-end," +
    "section.print-page h1,section.print-page h2,section.print-page h3," +
    "section.print-page h4,section.print-page h5,section.print-page h6")
  
  var current_heading_depth = 0;
  var current_section_depth = 0;
  // var inserted_padding_row = false;

  // Extract table of contents depth
  var toc_depth = document.getElementById("print-page-toc").getAttribute("data-toc-depth")

  for (var i = 0; i < toc_elements.length; i++) {
    
    // Get the info from the element
    el = toc_elements[i]
    link = "#" + el.id;
    tag = el.tagName
    tag_level = tag.substring(1)
    // Get the text of a heading
    // We use .firstChild.nodeValue instead of .innerText
    // because of elements like:
    // <h1 id="index-mkdocs-print-site-plugin">
    //     mkdocs-print-site-plugin<a class="headerlink" href="#index-mkdocs-print-site-plugin" title="Permanent link">↵</a>
    //  </h1>
    title = el.firstChild.nodeValue;
    if ( title.length == 0 ) {
      continue;
    }

    // Don't put the toc h1 in the toc
    if ( el.classList.contains('print-page-toc-title') ) {
      continue;
    }
    // Ignore the MkDocs keyboard Model
    if ( el.id.indexOf("keyboardModalLabel") > -1 ) {
      continue;
    }

    // print-site-plugin has a setting to control TOC depth
    if ( tag_level > toc_depth ) {
      continue;
    }

  

    // // If the section pages end
    // if ( el.classList.contains('nav-section-title-end') ) {
    //   current_section_depth--;
    //   // Add some padding, but make sure not twice in a row
    //   // That can happen with nested sections going back up 2 levels
    //   if (inserted_padding_row == false ) {
    //     ToC += "</div>"; // end section.
    //     ToC += "<li style='list-style-type: none; padding-bottom: 1em;'></li>";
    //     inserted_padding_row = true;
    //   }
    //   continue;
    // }
    // inserted_padding_row = false;

    if (el.classList.contains('nav-section-title') ) {
      ToC += "<li class='toc-nav-section-title'>" + title + "</li>";

      if ( current_section_depth == 0 ) {
          // Close normal ul to start a section ul
          ToC += "</ul>"
          current_section_depth++;
      } 
      ToC += "<ul class='print-site-toc-level-" + current_heading_depth + " toc-section-line-border'>";
      continue;
    }
    if (el.classList.contains('nav-section-title-end') ) {
      current_section_depth--;
      ToC += "</ul>";
      if ( current_section_depth == 0 ) {
        // Start back normal ul
        ToC += "<ul class='print-site-toc-level-" + current_heading_depth + "'>";
      }
      continue;
    }

    while (tag_level > current_heading_depth) {
      current_heading_depth++;
      ToC += "<ul class='print-site-toc-level-" + current_heading_depth + "'>";
    }
    while (tag_level < current_heading_depth) {
      current_heading_depth--;
      ToC += "</ul>"; 
    }



    // if ( el.classList.contains('nav-section-title') ) {
    //   // newLine = "<li class='toc-nav-section-title'>" + title + "</li>"; 
    //   current_section_depth++;
    //   newLine = "<li class='toc-nav-section-title toc-nav-section-title-level-" + current_section_depth + "' style='margin-left: " + (current_section_depth-1) + "em'>" + title + "</li>"; 
    //   newLine += "<div class='toc-section-line-border'>";
    // } else {

    //   if ( current_section_depth >= 1) {
    //     a_class = " class='toc-nav-section-child' style='margin-left: " + (current_section_depth-1) + "em'"
    //   } else {
    //     a_class = ""
    //   }

    //   newLine =
    //     "<li" + a_class + ">" +
    //       "<a href='" + link + "'>" +
    //         title +
    //       "</a>" +
    //     "</li>";
    // }
    a_class = "";
    newLine =
    "<li" + a_class + ">" +
      "<a href='" + link + "'>" +
        title +
      "</a>" +
    "</li>";

    ToC += newLine;

  };

  ToC += "</ul>"

  document.querySelectorAll("#print-page-toc nav")[0].insertAdjacentHTML("beforeend", ToC);

}