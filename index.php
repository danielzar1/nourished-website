<?php
get_header();
?>
<main id="main" class="site-main">
    <?php
    if ( have_posts() ) {
        while ( have_posts() ) {
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'section' ); ?>>
                <div class="container">
                    <header class="entry-header">
                        <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
                    </header>
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </div>
            </article>
            <?php
        }
    } else {
        ?>
        <div class="section">
            <div class="container center">
                <h2><?php esc_html_e( 'Nothing found', 'nourished' ); ?></h2>
            </div>
        </div>
        <?php
    }
    ?>
</main>
<?php
get_footer();
