<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://s0.wp.com/wp-content/themes/vip/espn-fivethirtyeight/assets/css/fivethirtyeight.src.css">
        <link rel="stylesheet" href="assets/css/madden.css">
    </head>
    <body>
      <?
      require_once 'Mobile_Detect.php';
      $detect = new Mobile_Detect;
      if ( $detect->isMobile() ) { $isMobile = true; } else { $isMobile = false; }
      ?>
      <div id="madden" class="entry-content">
				<?php

				define( 'FTE_MADDEN_DAY_2', true ); // set to true on day 2

				if ( ! function_exists( 'esc_url' ) ) {
					function esc_url( $s ) {
						return $s;
					}
				}

				class MaddenSpecial {
					function special_directory_uri() {}
				}
				$fte_madden = new MaddenSpecial();

				require('header.php');
				require('part1.php');
				if ( FTE_MADDEN_DAY_2 ) {
					require('part2.php');
				}
				?>
      </div>
      <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
      <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>

      <script src="assets/js/madden.js"></script>
      <script src="assets/js/underscore.min.js"></script>
      <script src="https://s0.wp.com/wp-content/themes/vip/espn-fivethirtyeight/assets/js/fivethirtyeight.src.js"></script>
      <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
    </body>
</html>
