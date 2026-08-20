#!/bin/sh

set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
CRITICAL_CSS="$ROOT_DIR/assets/css/critical.css"
UTILITY_CSS="$ROOT_DIR/assets/css/utility.css"
INDEX_HTML="$ROOT_DIR/index.html"

minify_css() {
    perl -0pe '
        s{/\*(?!\!)[\s\S]*?\*/}{}g;
        s/\s+/ /g;
        s/\s*([{}:;,>])\s*/$1/g;
        s/;}/}/g;
        s/^\s+|\s+$//g;
    ' "$1"
}

write_minified_css() {
    source_file=$1
    output_file=$2
    temporary_file=$(mktemp "${TMPDIR:-/tmp}/creative-css.XXXXXX")
    trap 'rm -f "$temporary_file"' EXIT INT TERM
    minify_css "$source_file" > "$temporary_file"
    mv "$temporary_file" "$output_file"
    trap - EXIT INT TERM
}

update_critical_css() {
    temporary_file=$(mktemp "${TMPDIR:-/tmp}/creative-critical.XXXXXX")
    trap 'rm -f "$temporary_file"' EXIT INT TERM
    minify_css "$CRITICAL_CSS" > "$temporary_file"
    CRITICAL_FILE="$temporary_file" INDEX_FILE="$INDEX_HTML" perl -0e '
        open my $critical_fh, "<", $ENV{CRITICAL_FILE} or die "$!\n";
        local $/;
        my $critical_css = <$critical_fh>;
        close $critical_fh;

        open my $index_fh, "<", $ENV{INDEX_FILE} or die "$!\n";
        my $index_html = <$index_fh>;
        close $index_fh;

        my $replaced = $index_html =~ s{(<style id="critical-css">).*?(</style>)}{$1 . $critical_css . $2}se;
        die "Could not find <style id=\"critical-css\"> in $ENV{INDEX_FILE}\n" unless $replaced;

        open my $output_fh, ">", $ENV{INDEX_FILE} or die "$!\n";
        print {$output_fh} $index_html;
        close $output_fh;
    '
    rm -f "$temporary_file"
    trap - EXIT INT TERM
}

update_utility_css() {
    temporary_file=$(mktemp "${TMPDIR:-/tmp}/creative-utility.XXXXXX")
    trap 'rm -f "$temporary_file"' EXIT INT TERM
    minify_css "$UTILITY_CSS" > "$temporary_file"
    UTILITY_FILE="$temporary_file" ROOT_DIR="$ROOT_DIR" perl -0e '
        use File::Find;

        open my $utility_fh, "<", $ENV{UTILITY_FILE} or die "$!\n";
        local $/;
        my $utility_css = <$utility_fh>;
        close $utility_fh;

        my $updated = 0;
        find(sub {
            return unless -f $_ && /\.html\z/;
            my $html_file = $File::Find::name;
            open my $html_fh, "<", $html_file or die "$!\n";
            my $html = <$html_fh>;
            close $html_fh;

            my $replaced = $html =~ s{(<style id="utility-css">).*?(</style>)}{$1 . $utility_css . $2}se;
            if ($replaced) {
                open my $output_fh, ">", $html_file or die "$!\n";
                print {$output_fh} $html;
                close $output_fh;
                $updated++;
            }
        }, $ENV{ROOT_DIR});
        die "Could not find <style id=\"utility-css\"> in any HTML file\n" unless $updated;
    '
    rm -f "$temporary_file"
    trap - EXIT INT TERM
}

build() {
    update_critical_css
    update_utility_css
    write_minified_css "$ROOT_DIR/assets/css/style.css" "$ROOT_DIR/assets/css/style.min.css"
    write_minified_css "$ROOT_DIR/articles/assets/css/style.css" "$ROOT_DIR/articles/assets/css/style.min.css"
    printf '%s\n' "CSS updated."
}

file_mtime() {
    stat -f '%m' "$1" 2>/dev/null || stat -c '%Y' "$1"
}

watch() {
    critical_mtime=$(file_mtime "$CRITICAL_CSS")
    utility_mtime=$(file_mtime "$UTILITY_CSS")
    root_style_mtime=$(file_mtime "$ROOT_DIR/assets/css/style.css")
    articles_style_mtime=$(file_mtime "$ROOT_DIR/articles/assets/css/style.css")

    while :; do
        sleep 1
        new_critical_mtime=$(file_mtime "$CRITICAL_CSS")
        new_utility_mtime=$(file_mtime "$UTILITY_CSS")
        new_root_style_mtime=$(file_mtime "$ROOT_DIR/assets/css/style.css")
        new_articles_style_mtime=$(file_mtime "$ROOT_DIR/articles/assets/css/style.css")

        if [ "$new_critical_mtime" != "$critical_mtime" ] ||
            [ "$new_utility_mtime" != "$utility_mtime" ] ||
            [ "$new_root_style_mtime" != "$root_style_mtime" ] ||
            [ "$new_articles_style_mtime" != "$articles_style_mtime" ]; then
            build
            critical_mtime=$new_critical_mtime
            utility_mtime=$new_utility_mtime
            root_style_mtime=$new_root_style_mtime
            articles_style_mtime=$new_articles_style_mtime
        fi
    done
}

case "${1:-}" in
    --watch)
        build
        watch
        ;;
    "")
        build
        ;;
    *)
        printf 'Usage: %s [--watch]\n' "$0" >&2
        exit 2
        ;;
esac