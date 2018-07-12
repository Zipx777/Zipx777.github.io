<!DOCTYPE html>
<html>

  <head>
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="description" content="Zipx777.GitHub.io : website">

    <link rel="stylesheet" type="text/css" media="screen" href="stylesheets/stylesheet.css">
    <link rel="stylesheet" type="text/css" media="screen" href="stylesheets/patterns.css">
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css">
	
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
	<script src="https://code.jquery.com/ui/1.9.2/jquery-ui.js"></script> 
	<script src="javascripts/bumpers/requestAnimationFrame.js"></script>
    <script src="javascripts/patterns/main.js"></script>
	  
    <title>Zipx777.GitHub.io</title>
  </head>

  <body>

    <!-- HEADER -->
    <?php include 'header.php'; ?>
	  
    <!-- MAIN CONTENT -->
    <div id="main_content_wrap" class="outer">
      <section id="main_content" class="inner">
        <h3><a id="welcome-to-github-pages" class="anchor" href="#welcome-to-github-pages" aria-hidden="true"><span class="octicon octicon-link"></span></a>Patterns</h3>
		<p>Start somewhere in the middle, with 3 points around the outside. Randomly pick one of the 3 points, draw a dot halfway to that point, and repeat.</p>
		
		<div id="patternsBoard">
			<canvas id="patternsCanvas" height="400" width="600"></canvas>
		</div>
		<div id="patternsBoardFooter">
			<button id="patternsStartButton">Start</button>
			<button id="patternsStopButton">Stop</button>
			<div id="sliderArea">
				<div id="slider"></div>
			</div>
			<div id="sliderText">Realistic with some bugs</div>
		</div>
      </section>
    </div>

    <!-- FOOTER  -->
    <div id="footer_wrap" class="outer">
      <footer class="inner">
        <p>Published with <a href="https://pages.github.com">GitHub Pages</a></p>
      </footer>
    </div>

    

  </body>
</html>
