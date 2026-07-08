<?php
get_header();
?>
<main id="main" class="site-main">
    <div class="section">
        <div class="container center stack">
            <h1><?php esc_html_e( '404 - Page Not Found', 'nourished' ); ?></h1>
            <p><?php esc_html_e( 'Sorry, the page you are looking for does not exist.', 'nourished' ); ?></p>
            <a class="btn btn--lg" href="<?php echo esc_url( home_url() ); ?>"><?php esc_html_e( 'Back to Home', 'nourished' ); ?></a>
        </div>
    </div>
</main>
<?php
get_footer();
