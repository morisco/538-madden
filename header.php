<header>
  <div class="header-wrapper">
    <a class="logo" href="/"><img class="words" src="<?php echo get_stylesheet_directory_uri(); ?>/img/538-logo.png" alt="FiveThirtyEight Sports - Home" /><img class="fox" src="<?php echo get_stylesheet_directory_uri(); ?>img/fox-logo.svg" alt="FiveThirtyEight Sports - Home" /></a>
    <nav>
      <a class="title-bar">The Virtual NFL:</a>
      <a href="#part1" target="_self" id="part-1-link">Part 1</a>
      <?php if (FTE_MADDEN_DAY_2 ) : ?>
      <a href="#part2" target="_self" id="part-2-link">Part 2</a>
      <?php endif; ?>
    </nav>
    <div class="social-links">
      <a href="#" class="social"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/twitter.svg" alt="Share on Twitter" /></a>
      <a href="#" class="social"><img src="<?php echo get_stylesheet_directory_uri(); ?>/img/facebook.svg" alt="Share on Facebook" /></a>
    </div>
  </div>
</header>